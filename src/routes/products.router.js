const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

// Endpoint para obtener todos los productos con un límite opcional
router.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit); // Obtener el límite de resultados de la query param
        const products = await productManager.getProducts(); // Obtener todos los productos
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

// Endpoint para obtener un producto por su ID
router.get('/products/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid); // Obtener el product ID de req.params
        const product = await productManager.getProductById(pid); // Obtener el producto por su ID

        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Agregar un nuevo producto:
router.post("/products", async (req, res) => {
    const nuevoProducto = req.body; // Obtengo el nuevo producto del body

    const { title, description, price, img, code, stock, category, thumbnails } = nuevoProducto; // Desestructuro el objeto para obtener cada propiedad

    try {
        await productManager.addProduct(title, description, price, img, code, stock, category, thumbnails); // Paso cada propiedad por separado a addProduct
        res.status(201).json({ message: "Product added successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        res.status(400).json({ error: error.message }); // Capturo y envio el mensaje de error al cliente en Postman
    }
})

// Actualizar por ID:
router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid; // Obtengo como parametro el ID a modificar
    const productoActualizado = req.body; // Obtengo del body los datos del producto a actualizar.

    try {
        await productManager.updateProduct(parseInt(id), productoActualizado); // Intento actualizar el producto

        res.json({ message: "Product updated successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        // Si se lanzó un error durante la actualización, enviar el mensaje de error al cliente
        res.status(400).json({ error: error.message });
    }
})

// Eliminar producto:
router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid; // Obtengo por parámetro el id a eliminar

    try {
        await productManager.deleteProduct(parseInt(id)); // Intento eliminar el producto

        res.json({ message: "Product deleted successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        // Si se lanzó un error durante la eliminación, enviar el mensaje de error al cliente
        res.status(400).json({ error: error.message });
    }
})
module.exports = router;
