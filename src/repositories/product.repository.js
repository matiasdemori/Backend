// Importo el modelo de Producto desde el archivo product.model.js en la carpeta models
const ProductModel = require("../models/product.model.js");

class ProductRepository {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails, owner }) {
        try {
            // Verifico que todos los campos obligatorios estén presentes
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("All fields are required");
                return;
            }

            // Compruebo si ya existe un producto con el mismo código
            // Busco en la base de datos un producto cuyo código coincida con el código proporcionado
            const existeProducto = await ProductModel.findOne({ code: code });
            // Si existe un producto con el mismo código, muestro un mensaje de que el código debe ser único y se finaliza la función
            if (existeProducto) {
                console.log("The code must be unique");
                return;
            }
            // Muestro un mensaje indicando que el producto fue agregado
            console.log("owner", owner);

            // Creo un nuevo producto con los datos proporcionados
            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
                owner
            });

            // Guardo el nuevo producto en la base de datos
            await newProduct.save();
            return newProduct;

        } catch (error) {
            // Capturo cualquier error que ocurra durante la ejecución del código dentro del bloque try
            console.log("Error adding a product", error); //Muestro un mensaje de error en la consola al agregar el producto, con el error en cuestion
            throw error; // Envio nuevamente el error para que sea manejado por bloques superiores 
        }
    }


    async getProducts({ limit = 10, page = 1, sort = "", query = "" } = {}) {
        try {
            // Calculo el número de documentos a omitir según la página y el límite de resultados por página
            const skip = (page - 1) * limit;

            // Opciones de consulta inicialmente vacías
            let queryOptions = {};

            // Configuro las opciones de consulta según el parámetro de búsqueda (si existe)
            if (query) {
                queryOptions = { category: query };
            }

            // Opciones de ordenamiento inicialmente vacías
            const sortOptions = {};

            // Verifico si se proporcionó un valor válido para sort y configuro las opciones de ordenamiento
            if (sort === 'asc') {
                sortOptions.price = 1; // Orden ascendente por precio
            } else if (sort === 'desc') {
                sortOptions.price = -1; // Orden descendente por precio
            } else if (sort) {
                throw new Error("Invalid sort parameter. Sort must be 'asc' or 'desc'.");
            }

            // Obtengo los productos según las opciones de consulta, ordenamiento, paginación y límite
            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            // Obtengo el total de productos que coinciden con las opciones de consulta
            const totalProducts = await ProductModel.countDocuments(queryOptions);

            // Calculo el número total de páginas según el límite de productos por página
            const totalPages = Math.ceil(totalProducts / limit);

            // Determino si hay una página previa y una página siguiente
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Devuelvo la respuesta con los productos, metadatos de paginación y enlaces a páginas previas/siguientes
            return {
                docs: productos, // Array de productos
                totalPages, // Número total de páginas
                prevPage: hasPrevPage ? page - 1 : null, // Número de página previa (si existe)
                nextPage: hasNextPage ? page + 1 : null, // Número de página siguiente (si existe)
                page, // Número de página actual
                hasPrevPage, // Indicador de página previa
                hasNextPage, // Indicador de página siguiente
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null, // Enlace a la página previa (si existe)
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null, // Enlace a la página siguiente (si existe)
            };
        } catch (error) {
            // Manejo errores en caso de fallo en la consulta
            console.log("Error obtaining the products", error);
            throw error;
        }
    }

    // Contar todos los productos
    async countProducts() {
        try {
            const count = await ProductModel.countDocuments();
            return count;
        } catch (error) {
            console.log("Error counting products", error);
            throw error;
        }
    }


    async getProductById(id) {
        try {
            // Valido que el ID sea un formato válido antes de buscar el producto
            if (!id || typeof id !== 'string') {
                throw new Error("Invalid ID. The ID must be a non-empty string.");
            }

            // Busco un producto en la base de datos por su ID utilizando el método findById proporcionado por el modelo ProductModel
            const producto = await ProductModel.findById(id);

            // Verifico si el producto no fue encontrado
            if (!producto) {
                console.log("Product not found");
                return null;
            }

            // Muestro un mensaje indicando que el producto fue encontrado
            console.log("Product found");
            // Devuelvo el producto
            return producto;

        } catch (error) {
            // Manejo errores específicos
            if (error instanceof Error) {
                // Si es un error de tipo Error, muestro un mensaje de error indicando que hubo un problema al buscar el producto por su ID, seguido del mensaje de error específico
                console.log("Error when searching for product by ID:", error.message);
            } else {
                // Si el error no es de tipo Error, muestro un mensaje genérico indicando que ocurrió un error desconocido al buscar el producto por su ID
                console.log("Unknown error when searching for product by ID");
            }
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            // Valido que el ID sea un formato válido antes de actualizar el producto
            if (!id || typeof id !== 'string') {
                throw new Error("Invalid ID. The ID must be a non-empty string.");
            }

            // Valido que los datos de actualización sean válidos y contengan al menos un campo
            if (!productoActualizado || typeof productoActualizado !== 'object' || Object.keys(productoActualizado).length === 0) {
                throw new Error("Invalid update data. At least one field is required to update.");
            }

            // Actualizo el producto en la base de datos por su ID utilizando findByIdAndUpdate
            const updateProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });

            // Verifico si el producto no fue encontrado para actualizar
            if (!updateProduct) {
                console.log("Product not found to update");
                return null;
            }

            console.log("Successfully updated product");
            // Retorno el producto actualizado
            return updateProduct;

        } catch (error) {
            // Manejo errores específicos
            if (error instanceof Error) {
                console.log("Error updating product:", error.message);
            } else {
                console.log("Unknown error when updating product");
            }
            // Lanzar nuevamente el error para que sea manejado por bloques superiores o por el sistema en general
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            // Valido que el ID sea un formato válido antes de eliminar el producto
            if (!id || typeof id !== 'string') {
                throw new Error("Invalid ID. The ID must be a non-empty string.");
            }

            // Elimino el producto en la base de datos por su ID utilizando findByIdAndDelete
            const deleteProduct = await ProductModel.findByIdAndDelete(id);

            // Verifico si el producto no fue encontrado para eliminar
            if (!deleteProduct) {
                console.log("Product not found to delete");
                return null;
            }

            console.log("Product deleted correctly");
            return deleteProduct;

        } catch (error) {
            // Manejo errores específicos
            if (error instanceof Error) {
                console.log("Error when deleting product:", error.message);
            } else {
                console.log("Unknown error when removing product");
            }
            // Lanzo nuevamente el error para que sea manejado por bloques superiores o por el sistema en general
            throw error;
        }
    }
}

// Exportar la clase ProductManager
module.exports = ProductRepository;