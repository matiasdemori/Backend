// Importo el módulo Express y creo un enrutador.
const express = require("express");
const router = express.Router();

// Importo la clase ProductManager del controlador.
const ProductManager = require("../controllers/product-manager.js");
// Creo una instancia de ProductManager
const productManager = new ProductManager();

// 1) Ruta para obtener productos con opciones de paginación, ordenamiento y búsqueda
router.get("/", async (req, res) => {
    try {
        // Obtengo los parámetros de la consulta (query string) de la solicitud
        const { limit = 10, page = 1, sort = "", query = "" } = req.query;
        // Llamo al método getProducts del gestor de productos para obtener los productos con las opciones especificadas
        const productos = await productManager.getProducts({
            limit: parseInt(limit), // Convierto el límite de resultados a un número entero
            page: parseInt(page), // Convierto el número de página a un número entero
            sort, // Ordeno la clasificación de los resultados
            query, // Parámetro de búsqueda opcional
        });

        // Devuelvo una respuesta JSON con los productos obtenidos y metadatos de paginación
        res.json({
            status: 'success',
            payload: productos.docs, // Productos obtenidos
            totalPages: productos.totalPages, // Número total de páginas de resultados
            prevPage: productos.prevPage, // Página anterior si está disponible
            nextPage: productos.nextPage, // Página siguiente si está disponible
            page: productos.page, // Página actual
            hasPrevPage: productos.hasPrevPage, // Indicador de si hay página anterior
            hasNextPage: productos.hasNextPage, // Indicador de si hay página siguiente
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null, // Enlace a la página anterior si está disponible
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null, // Enlace a la página siguiente si está disponible
        });

    } catch (error) {
        // Capturo errores en caso de que ocurra algún problema al obtener productos
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal Server Error"
        });
    }
});


// 2) Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid; // Obtengo el product ID de req.params
        const product = await productManager.getProductById(pid); // Obtengo el producto por su ID

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

// 3) Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body; // Obtengo el nuevo producto del body

    const { title, description, price, img, code, stock, category, thumbnails } = nuevoProducto; // Desestructuro el objeto para obtener cada propiedad
    
    try {
    await productManager.addProduct({title, description, price, img, code, stock, category, thumbnails}); // Paso cada propiedad por separado a addProduct
        res.status(201).json({ message: "Product added successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        res.status(400).json({ error: error.message }); // Capturo y envio el mensaje de error al cliente en Postman
    }
})

// 4) Ruta para actualizar por ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid; // Obtengo como parametro el ID a modificar
    const productoActualizado = req.body; // Obtengo del body los datos del producto a actualizar.

    try {
        await productManager.updateProduct(id, productoActualizado); // Intento actualizar el producto

        res.json({ message: "Product updated successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        // Si se lanzó un error durante la actualización, enviar el mensaje de error al cliente
        res.status(400).json({ error: error.message });
    }
})

// Ruta para eliminar un producto:
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid; // Obtengo por parámetro el id a eliminar

    try {
        await productManager.deleteProduct(id); // Intento eliminar el producto

        res.json({ message: "Product deleted successfully" }); // Si todo sale bien mando un ok.
    } catch (error) {
        // Si se lanzó un error durante la eliminación, enviar el mensaje de error al cliente
        res.status(400).json({ error: error.message });
    }
})


module.exports = router;
