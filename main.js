const fs = require('fs');

class ProductManager {
    static ultId = 0; //Se declara una variable estática inicializada en 0. See utiliza para asignar un identificador único a cada producto.
    constructor(path) {
        this.products = []; //Este array se utilizará para almacenar los productos. Se inicializa vacio. 
        this.path = path; //Representa la ruta del archivo donde se guardarán los datos de los productos.
    }

    async init() {
        try { //Se utiliza para manejar errores potenciales que pueden ocurrir durante la ejecución del código dentro de este bloque.
            if (!fs.existsSync(this.path)) { //Verifico si el archivo especificado existe en el sistema de archivos.
                await fs.promises.writeFile(this.path, '[]', 'utf-8');
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

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("All fields are mandatory..");
                return; // Verifico si alguno de los parámetros requeridos está vacío o es nulo. Si alguno de ellos lo es, muestro un mensaje de error en la consola.
            }

            if (this.products.some(product => product.code === code)) {
                console.log("A product with that code already exists.");
                return; // Verifico si ya existe un producto con el mismo código. Si es así, muestro un mensaje de error.
            }

            const newProduct = {
                id: ++ProductManager.ultId,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }; // Con esto creo un nuevo objeto que representa el producto a agregar. Tiene ID único que se genera incrementando el valor de la variable estática ultId de la clase.

            this.products.push(newProduct); // Agrega el nuevo producto newProduct al array this.products.
            await fs.promises.appendFile(this.path, JSON.stringify(newProduct), 'utf-8');
            console.log("Product added successfully.");
        } catch (error) {
            console.error("Error adding product:", error);
        } // Agrego un nuevo producto al array de productos, y muestra un mensaje indicando que el producto se ha agregado con éxito. Si ocurre algún error, se captura y se imprime un mensaje de error en la consola.
    }

    async getProducts() {
        try {
            // Leer los datos del archivo
            const productsData = await fs.promises.readFile(this.path, 'utf-8');
            // Analizar los datos como un JSON para obtener los productos
            const products = JSON.parse(productsData);
            return products;
        } catch (error) {
            console.error("Error getting products:", error);
            return []; // En caso de error, devolver un array vacío
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
                console.log("Product found:", product);
            } else {
                console.log("Product not found.");
            }
        } catch (error) {
            console.error("Error getting product by id:", error);
        }
    }

    async saveToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
        } catch (error) {
            console.error("Error saving to file:", error);
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

// Testing:

// 1) Crear una instancia de la clase "ProductManager"
const { error } = require("console");
const misProductos = './productos.json';
const productManager = new ProductManager(misProductos);

// 2) Llamar a "getProducts" inmediatamente después de crear la instancia, debería devolver un arreglo vacío []
(async () => {
    try {
        const productos = await productManager.getProducts();
        console.log("Productos obtenidos:", productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
})();

// 3) Llamar al método "addProduct" con los siguientes campos:
(async () => {
    try {
        await productManager.addProduct(
            "producto prueba",
            "Este es un producto prueba",
            200,
            "Sin imagen",
            "abc123",
            25
        );
    } catch (error) {
        console.error("Error al agregar producto:", error);
    }
})();

// 4) Agregar otro producto
(async () => {
    try {
        await productManager.addProduct(
            "otro producto",
            "Este es otro producto de prueba",
            150,
            "Sin imagen",
            "xyz456",
            30
        );
    } catch (error) {
        console.error("Error al agregar otro producto:", error);
    }
})();

// 5) Obtener todos los productos, incluido el recién agregado
(async () => {
    try {
        const productos = await productManager.getProducts();
        console.log("Productos actuales:", productos);
    } catch (error) {
        console.error("Error al obtener productos actuales:", error);
    }
})();

// 6) Obtener el producto por su ID (debería encontrarlo) y obtener un producto con un ID que no existe (debería fallar)
(async () => {
    try {
        console.log("Buscando producto existente:");
        await productManager.getProductById(1);

        console.log("Buscando producto inexistente:");
        await productManager.getProductById(999);
    } catch (error) {
        console.error("Error al buscar producto por ID:", error);
    }
})();

// 7) Actualizar el producto recién agregado y obtener el producto actualizado
(async () => {
    try {
        console.log("\nActualizando el producto:");
        await productManager.updateProduct(1, { price: 250 });

        console.log("\nBuscando producto actualizado:");
        await productManager.getProductById(1);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
    }
})();

// 8) Eliminar un producto existente e intentar eliminar un producto que no existe
(async () => {
    try {
        console.log("Eliminando producto con ID 2:");
        await productManager.deleteProduct(2);

        console.log("Intentando eliminar producto con ID 10 (que no existe):");
        await productManager.deleteProduct(10);
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
})();