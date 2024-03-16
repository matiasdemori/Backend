const express = require('express');
const fs = require('fs').promises;
const ProductManager = require('./product-manager.js');

const app = express();
const PORT = 8080; // Puerto en el que se ejecutará el servidor
const productManager = new ProductManager("./src/products.json"); // Ruta del archivo de productos

// Endpoint para obtener todos los productos con un límite opcional
app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit); // Obtener el límite de resultados de la query param
        const products = await productManager.getProducts(); // Obtener todos los productos
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});