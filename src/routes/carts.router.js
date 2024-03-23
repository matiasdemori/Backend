// Importo el módulo Express y creo un enrutador.
const express = require("express");
const router = express.Router();

// Importo la clase CartManager del controlador.
const CartManager = require("../controllers/cart-manager.js");

// Creo una instancia de CartManager y especifico la ubicación del archivo JSON.
const cartManager = new CartManager("./src/models/carts.json");

// 1) Ruta para crear un nuevo carrito.
router.post("/carts", async (req, res) => {
    try {
        // Llamo al método para crear un nuevo carrito.
        const nuevoCarrito = await cartManager.crearCarrito();
        
        // Devuelvo el carrito recién creado en formato JSON.
        res.json(nuevoCarrito);
    } catch (error) {
        // Informo el error generado durante la creación del carrito.
        console.error("Error creating cart", error);
        res.status(500).json({ error: "Internal server error creating the cart" });
    }
});

// 2) Ruta para obtener los productos de un carrito específico.
router.get("/carts/:cid", async (req, res) => {
    // Obtengo el ID del carrito desde los parámetros de la solicitud.
    const cartId = parseInt(req.params.cid);

    try {
        // Llamo al método getCarritoById de CartManager para obtener el carrito por su ID.
        const carrito = await cartManager.getCarritoById(cartId);
        
        // Devuelvo los productos del carrito como respuesta en formato JSON.
        res.json(carrito.products);
    } catch (error) {
        // Informo el error generado durante la obtención de productos del carrito.
        console.error("Error getting cart products:", error);
        res.status(500).json({ error: "Internal server error while getting cart products" });
    }
});


// 3) Ruta para agregar productos a un carrito.
router.post("/carts/:cid/product/:pid", async (req, res) => {
    // Obtengo el ID del carrito y el ID del producto desde los parámetros de la solicitud.
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    
    // Obtengo la cantidad del producto desde el cuerpo de la solicitud si no tiene la establezco en 1 por defecto.
    const quantity = parseInt(req.body.quantity) || 1;

    // Valido que la cantidad sea un número entero positivo.
    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "The quantity must be a positive integer" });
    }

    try {
        // Llamo al método agregarProductoAlCarrito de CartManager para agregar un producto al carrito.
        const updatedCart = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        
        // Devuelvo los productos actualizados del carrito como respuesta en formato JSON.
        res.json(updatedCart.products);
    } catch (error) {
        // Informo el error generado durante la obtención de productos del carrito.
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: "Internal server error while adding product to cart" });
    }
});

// Exportar el enrutador para su uso en la aplicación principal
module.exports = router;
