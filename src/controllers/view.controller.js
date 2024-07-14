// Importo el repositorio de Carts
const CartRepository = require("../repositories/cart.repository.js");
// Genero una instancia de CartRepository
const cartRepository = new CartRepository();
// Importo el repositorio de Product
const ProductRepository = require("../repositories/product.repository.js");
// Genero una instancia de ProductRepository
const productRepository = new ProductRepository();


class ViewsController {
    // Renderizo la vista de los productos
    async renderProducts(req, res) {
        try {
            // Obtengo los parámetros de la consulta (query string) de la solicitud
            const { page = 1, limit = 3 } = req.query;

            // Calculo el número de documentos a omitir por la página
            const skip = (page - 1) * limit;

            // Obtengo todos los productos
            const productos = await productRepository.getProducts()
                .skip(skip)
                .limit(limit);

            // Obtengo el número total de productos
            const totalProducts = await productRepository.countProducts();

            // Calculo el número total de páginas
            const totalPages = Math.ceil(totalProducts / limit);

            // Verifico si hay páginas anteriores y posteriores
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Mapeo los productos para obtener un nuevo array con información detallada
            const nuevoArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest }; // Agregar el ID al objeto
            });

            // Obtengo el ID del carrito del usuario
            const cartId = req.user.cart.toString();

            // Renderizo la plantilla con los datos obtenidos
            res.render("products", {
                productos: nuevoArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }

    // Renderizo la vista del carrito
    async renderCart(req, res) {
        // Obtengo el ID del carrito desde los parámetros de la petición
        const cartId = req.params.cid;

        try {
            // Obtengo el carrito por su ID
            const carrito = await cartRepository.getCarritoById(cartId);

            // Verifico si el carrito no existe
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            // Mapeo los productos en el carrito para obtener un nuevo array con información detallada
            let totalCompra = 0;
            const productosEnCarrito = carrito.products.map(item => {
                // Obtengo el objeto del producto
                const product = item.product.toObject();

                // Obtengo el precio del producto
                const quantity = item.quantity;

                // Calculo el total del producto con el precio y la cantidad  
                const totalPrice = product.price * quantity;

                // Sumo el total de los productos
                totalCompra += totalPrice;

                // Retorno un objeto con el objeto del producto, la cantidad y el ID del carrito
                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            // Renderizo la plantilla "carts" con los productos del carrito
            res.render("carts", { productos: productosEnCarrito, totalCompra, cartId });

        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Renderiza la vista de inicio de sesión
    async renderLogin(req, res) {
        res.render("login");
    }

    // Renderizo la vista de registro
    async renderRegister(req, res) {
        res.render("register");
    }

    // Renderizo la vista de perfil
    async renderProfile(req, res) {
        res.render("profile");
    }

    // Renderizo la vista realtimeproducts
    async renderRealTimeProducts(req, res) {
        const usuario = req.user;
        try {
            res.render("realtimeproducts", { role: usuario.role, email: usuario.email });
        } catch (error) {
            console.log("error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Renderiza la vista de chat
    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }

    //Tercer integradora: 
    async renderResetPassword(req, res) {
        res.render("passwordreset");
    }

    async renderCambioPassword(req, res) {
        res.render("passwordcambio");
    }

    async renderConfirmacion(req, res) {
        res.render("confirmacion-envio");
    }

}

module.exports = ViewsController;