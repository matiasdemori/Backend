// Importo el módulo Express y creo un enrutador.
const express = require("express");
const router = express.Router();

// Importo la clase ProductManager del controlador.
const ProductController = require("../controllers/product.controller.js");
// Creo una instancia de ProductManager
const productController = new ProductController();

// Importo el módulo Passport
const passport = require("passport");

// 1) Ruta para obtener productos con opciones de paginación, ordenamiento y búsqueda
router.get("/", productController.getProducts);

// 2) Ruta para obtener un producto por su ID
router.get("/:pid", productController.getProductById);

// 3) Ruta para agregar un nuevo producto
router.post("/", passport.authenticate("jwt", { session: false }) ,productController.addProduct);

// 4) Ruta para actualizar un producto
router.put("/:pid", productController.updateProduct);

// 5) Ruta para eliminar un producto
router.delete("/:pid", productController.deleteProduct);

module.exports = router;