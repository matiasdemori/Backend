// Importo el módulo Express y creo un enrutador.
const express = require("express");
const router = express.Router();

// Importo la clase CartManager del controlador.
const CartManager = require("../controllers/cart-manager.js");
// Creo una instancia de CartManager 
const cartManager = new CartManager();

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
    const cartId = req.params.cid;

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
    const cartId = req.params.cid;
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


//4) Ruta para eliminar un producto especifico del carrito: 
router.delete('/carts/:cid/product/:pid', async (req, res) => {
    try {
        // Obtengo el ID del carrito y el ID del producto de los parámetros de la solicitud
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Llamo al método eliminarProductoDelCarrito del cartManager para eliminar el producto del carrito
        const updatedCart = await cartManager.eliminarProductoDelCarrito(cartId, productId);

        // Respondo con un mensaje de éxito y el carrito actualizado en formato JSON
        res.json({
            status: 'success',
            message: 'Product removed from cart successfully',
            updatedCart,
        });
    } catch (error) {
        // Manejo cualquier error capturado durante el proceso
        console.error('Error removing product from cart', error);
        // Respondo con un estado HTTP 500 y un mensaje de error en formato JSON
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});


//5) Ruta para actualizar los productos del carrito: 
router.put('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid; // Obtengo el ID del carrito desde los parámetros de la solicitud
    const updatedProducts = req.body; // Obtengo los productos actualizados desde el cuerpo de la solicitud

    try {
        // Llamo a la función actualizarCarrito del gestor de carritos para actualizar el carrito con los nuevos productos
        const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts);

        // Devuelvo el carrito actualizado como respuesta
        res.json(updatedCart);
    } catch (error) {
        // Capturo errores en caso de que ocurra algún problema durante la actualización del carrito
        console.error('Error updating cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});


//6) Ruta para actualizar las cantidades de los productos
router.put('/carts/:cid/product/:pid', async (req, res) => {
    try {
        // Obtengo el ID del carrito y el ID del producto desde los parámetros de la solicitud
        const cartId = req.params.cid;
        const productId = req.params.pid;
        // Obtengo la nueva cantidad del producto desde el cuerpo de la solicitud
        const newQuantity = req.body.quantity;

        // Llamo a la función actualizarCantidadDeProducto del gestor de carritos para actualizar la cantidad del producto en el carrito
        const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity);

        // Devvuelvo una respuesta JSON indicando el éxito de la operación y el carrito actualizado
        res.json({
            status: 'success',
            message: 'Product quantity updated correctly',
            updatedCart,
        });
    } catch (error) {
        // Capturo errores en caso de que ocurra algún problema durante la actualización del carrito
        console.error('Error updating the quantity of the product in the cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});


//7) Ruta para vaciar el carrito: 
router.delete('/carts/:cid', async (req, res) => {
    try {
        // Obtengo el ID del carrito desde los parámetros de la solicitud
        const cartId = req.params.cid;

        // Llamo a la función vaciarCarrito del gestor de carritos para eliminar todos los productos del carrito
        const updatedCart = await cartManager.vaciarCarrito(cartId);

        // Devuelvo una respuesta JSON indicando el éxito de la operación y el carrito actualizado
        res.json({
            status: 'success',
            message: 'All products in the cart were successfully removed',
            updatedCart,
        });
    } catch (error) {
        // Capturo errores en caso de que ocurra algún problema al vaciar el carrito
        console.error('Error emptying cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Internal Server Error',
        });
    }
});


// Exportar el enrutador para su uso en la aplicación principal
module.exports = router;
