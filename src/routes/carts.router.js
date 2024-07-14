// Importo el módulo Express y creo un enrutador.
const express = require("express");
const router = express.Router();

// Importo la clase CartManager del controlador.
const CartController = require("../controllers/cart.controller.js");
// Creo una instancia de CartController 
const cartController = new CartController();

// Importo el middleware authmiddleware.js
const authMiddleware = require("../middleware/authmiddleware.js");
// Middleware para la gestión de autenticación
router.use(authMiddleware);

// 1) Ruta para crear un nuevo carrito.
router.post("/", cartController.nuevoCarrito);

// 2) Ruta para obtener los productos de un carrito específico.
router.get("/:cid", cartController.getCarritoById);

// 3) Ruta para agregar productos a un carrito.
router.post("/:cid/product/:pid", cartController.agregarProductoAlCarrito);

// 4) Ruta para eliminar un producto especifico del carrito.
router.delete('/:cid/product/:pid', cartController.eliminarProductoDelCarrito);

// 5) Ruta para actualizar los productos del carrito.
router.put('/:cid', cartController.actualizarCarrito);

// 6) Ruta para actualizar las cantidades de los productos
router.put('/:cid/product/:pid', cartController.actualizarCantidadDeProducto);

// 7) Ruta para vaciar el carrito.
router.delete('/:cid', cartController.vaciarCarrito);

// 8) Ruta para finalizar la compra.
router.post('/:cid/purchase', cartController.finalizarCompra);

// Exportar el enrutador para su uso en la aplicación principal
module.exports = router;