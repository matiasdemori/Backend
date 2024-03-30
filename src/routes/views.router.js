const express = require("express");
const router = express.Router();

// Importo el controlador y creo una instancia del ProductManager.
const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

// Ruta para mostrar la lista de productos.
router.get("/", async (req, res) => {
    try {
        // Obtengo la lista de productos desde el ProductManager.
        const productos = await productManager.getProducts();
        // Renderizo la vista 'home' y paso la lista de productos como datos.
        res.render("home", { productos: productos });
    } catch (error) {
        // En caso de error, envio una respuesta con código de estado 500 y un mensaje de error.
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Ruta para la página de productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
    // Renderizar la vista 'realtimeproducts'
    res.render("realtimeproducts");
});

// Exportar el enrutador para ser utilizado en la aplicación principal
module.exports = router;