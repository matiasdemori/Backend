const express = require("express");
const router = express.Router();

// Importo el controlador ProductManager y creo una instancia.
const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

// Importo el controlador CartManager y creo una instancia.
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager();


// 1) Ruta para obtener productos con opciones de paginación
router.get("/products", async (req, res) => {
    try {
        // Obtengo los parámetros de paginación de la consulta (query string) de la solicitud
        const { page = 1, limit = 2 } = req.query;

        // Obtengo los productos del gestor de productos con las opciones de paginación especificadas
        const productos = await productManager.getProducts({
            page: parseInt(page), // Convierto el número de página a un número entero
            limit: parseInt(limit) // Convierto el límite de productos por página a un número entero
        });
        
        // Creo un nuevo array de productos sin el campo _id utilizando el método map y destructuring
        const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject(); // Extraigo el _id y el resto de las propiedades del producto
            return rest; // Retorno solo las demás propiedades sin _id
        });

        // Renderizo la plantilla "products" con los productos obtenidos y metadatos de paginación
        res.render("products", {
            productos: nuevoArray, // Productos a mostrar en la página
            hasPrevPage: productos.hasPrevPage, // Indicador de si hay página anterior
            hasNextPage: productos.hasNextPage, // Indicador de si hay página siguiente
            prevPage: productos.prevPage, // Número de página anterior si está disponible
            nextPage: productos.nextPage, // Número de página siguiente si está disponible
            currentPage: productos.page, // Número de página actual
            totalPages: productos.totalPages // Número total de páginas de resultados
        });

    } catch (error) {
        // Capturo y manejar errores en caso de que ocurra algún problema al obtener productos
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal Server Error"
        });
    }
});


// 2) Ruta para obtener los productos de un carrito específico por su ID
router.get("/carts/:cid", async (req, res) => {
    // Obtengo el ID del carrito desde los parámetros de la solicitud
    const cartId = req.params.cid;

    try {
        // Obtengo el carrito por su ID utilizando el gestor de carritos
        const carrito = await cartManager.getCarritoById(cartId);

        // Verifico si el carrito no existe
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Mapeo los productos en el carrito para obtener un nuevo array con información detallada
        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(), // Convierto el producto a objeto para evitar restricciones
            quantity: item.quantity // Cantidad del producto en el carrito
        }));

        // Renderizo la plantilla "carts" con los productos del carrito
        res.render("carts", { productos: productosEnCarrito });

    } catch (error) {
        // Capturo errores en caso de que ocurra algún problema al obtener el carrito
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 3) Ruta para la página de productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
    // Renderizar la vista 'realtimeproducts'
    res.render("realtimeproducts");
});

// 4) Ruta para el chat
router.get("/chat", (req, res) => {
    // Renderizo los chats
    res.render("chat");
});

//LOGIN

// Ruta para la página de inicio de sesión
router.get("/login", (req, res) => {
    // Verifico si el usuario ya está logueado, de ser asi lo redirijo a la página de productos
    if (req.session.login) {
        return res.redirect("/products");
    }

    // Renderizo la vista de inicio de sesión
    res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
    // Verifico si el usuario ya está logueado y redirige a la página de perfil si es así
    if (req.session.login) {
        return res.redirect("/profile");
    }

    // Renderizo el formulario de registro
    res.render("register");
});

// Ruta para la vista de perfil
router.get("/profile", (req, res) => {
    // Verifico si el usuario está logueado
    if (!req.session.login) {
        // Redirijo al formulario de inicio de sesión si no está logueado
        return res.redirect("/login");
    }

    // Renderizo la vista de perfil con los datos del usuario
    res.render("profile", { user: req.session.user });
});

// Exporto el enrutador para ser utilizado en la aplicación principal
module.exports = router;