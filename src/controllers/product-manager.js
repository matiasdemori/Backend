const fs = require('fs');

class ProductManager {
    static ultId = 0; //Declaro una variable estática que inicia en 0. La utilizo para asignar un id único a cada producto.
    constructor(path) {
        this.products = []; //Este array se utiliza para almacenar los productos. Se inicializa vacio. 
        this.path = path; //Representa la ruta del archivo donde se guardarán los datos de los productos.
    }

    async init() {
        try { //Se utiliza para manejar errores potenciales que pueden ocurrir durante la ejecución del código dentro de este bloque.
            if (!fs.existsSync(this.path)) { //Verifico si el archivo especificado existe en el sistema de archivos.
                await fs.promises.writeFile(this.path, JSON.stringify(this.products), "utf-8");
            } else {
                const productsData = await fs.promises.readFile(this.path, 'utf-8');//Si el archivo existe, leo su contenido y lo grabo.
                this.products = JSON.parse(productsData);//Convierto los datos del archivo en un array de objetos que representan productos.
                // Obtener el último id para continuar la secuencia de ids
                const lastProduct = this.products[this.products.length - 1];
                ProductManager.ultId = lastProduct ? lastProduct.id : 0;
            }
        } catch (error) {
            console.error("Error initializing ProductManager:", error);
        }
    }//Con esta función busco que el ProductManager esté listo, cargando los productos almacenados desde un archivo si ya existen, o creando un archivo nuevo si no existe.


    async addProduct(title, description, price, img, code, stock, category, thumbnails) {
        try {
            // Leo el archivo JSON para obtener los productos existentes
            const existingProducts = await fs.promises.readFile(this.path, 'utf-8');
            const productsArray = JSON.parse(existingProducts);

            // Obtengo el último ID guardado en el archivo de productos y aumento en 1
            const lastProductId = productsArray.length > 0 ? productsArray[productsArray.length - 1].id : 0;
            const newId = lastProductId + 1;


            // Verifico si algún campo obligatorio está vacío
            if (!title || !description || !price || !img || !code || !stock || !category) {
                throw new Error("All fields are mandatory");
            }

            // Verifico el tipo de dato de cada campo
            if (typeof title !== 'string' ||
                typeof description !== 'string' ||
                typeof price !== 'number' ||
                typeof img !== 'string' ||
                typeof code !== 'string' ||
                typeof stock !== 'number' ||
                typeof category !== 'string') {
                throw new Error("Invalid data type for one or more fields");
            }

            // Verifico si ya existe un producto con el mismo código
            if (productsArray.some(product => product.code === code)) {
                throw new Error("A product with that code already exists.");
            }

            // Creo un nuevo objeto que representa el producto a agregar
            const newProduct = {
                id: newId,
                title: title,
                description: description,
                price: price,
                img: img,
                category: category,
                thumbnail: thumbnails,
                code: code,
                stock: stock,
                status: true // Establecer el campo status como true por defecto
            };

            // Agrego el nuevo producto al array de productos
            productsArray.push(newProduct);

            // Escribo el array completo de productos en el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(productsArray), 'utf-8');

            console.log("Product added successfully.");
        } catch (error) {
            console.error("Error adding product:", error);
            throw error; // Relanzar el error para capturarlo en el enrutador
        }
    }

    async getProducts() {
        try {
            // Leo los datos del archivo
            const productsData = await fs.promises.readFile(this.path, 'utf-8');
            // Analizo los datos como un JSON para obtener los productos
            const products = JSON.parse(productsData);
            return products; //Devuelvo el array de productos
        } catch (error) {
            console.error("Error getting products:", error);
            return []; // En caso de error, devuelvo un array vacío
        }
    }

    async getProductById(id) {
        try {
            // Leo los datos del archivo
            const productsData = await fs.promises.readFile(this.path, 'utf-8');
            // Analizo los datos como un JSON para obtener los productos
            const products = JSON.parse(productsData);

            // Busco el producto por su ID
            const product = products.find(product => product.id === id);

            if (product) {
                return product;
            } else {
                console.log("Product not found.");
            }
        } catch (error) {
            console.error("Error getting product by id:", error);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            // Leer los productos existentes desde el archivo
            const productsData = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(productsData);

            // Buscar el índice del producto a actualizar en la lista de productos
            const index = products.findIndex(product => product.id === id);

            if (index !== -1) {
                // Actualizar el producto con los campos actualizados
                products[index] = { ...products[index], ...updatedFields };

                // Escribir la lista actualizada de productos en el archivo
                await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');

                console.log("Product updated successfully.");
            } else {
                console.log("Product not found.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    async deleteProduct(id) {
        try {
            // Leer los productos existentes desde el archivo
            const productsData = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(productsData);

            // Buscar el índice del producto a eliminar en la lista de productos
            const index = products.findIndex(product => product.id === id);

            if (index !== -1) {
                // Eliminar el producto de la lista
                products.splice(index, 1);

                // Escribir la lista actualizada de productos en el archivo
                await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');

                console.log("Product deleted successfully.");
            } else {
                console.log("Product not found.");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
}

module.exports = ProductManager; // Exportar la clase ProductManager