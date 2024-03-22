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

    try {
        await productManager.addProduct(nuevoProducto); // Agrego el nuevo producto
        res.status(201).json({message: "Product added successfully"}); // Si todo sale bien mando un ok.
    } catch (error) {
        res.status(500).json({error: "Internal server error"}); // Si sale mal, sale el mensaje de error. 
    }
})

// Actualizar por ID:
router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid; // Obtengo como parametro el ID a modificar
    const productoActualizado = req.body; // Obtengo del body los datos del producto a actualizar.

    try {
        await productManager.updateProduct(parseInt(id), productoActualizado); // Busco actualizar el producto.
        res.json({ message: "Product updated successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        res.status(500).json({error: "Internal server error"}); // Si sale mal, sale el mensaje de error. 
    }
})

// Eliminar producto:
router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid; // Obtengo por parametro el id a eliminar

    try {
        await productManager.deleteProduct(parseInt(id)); // Busco eliminar el producto
        res.json({ message: "Product deleted successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        res.status(500).json({error: "Internal server error"}); // Si sale mal, sale el mensaje de error. 
    }
})

module.exports = router;
