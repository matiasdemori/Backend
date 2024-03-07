/** AFTER 1 - PRIMER DESAFIO ENTREGABLE **/

const fs = require('fs');

class ProductManager {
    static ultId = 0; //Se declara una variable estática inicializada en 0. See utiliza para asignar un identificador único a cada producto.
    constructor(path) {
        this.products = []; //Este array se utilizará para almacenar los productos. Se inicializa vacio. 
        this.path = path; //Representa la ruta del archivo donde se guardarán los datos de los productos.
    }

    async init() {
        try { //Se utiliza para manejar errores potenciales que pueden ocurrir durante la ejecución del código dentro de este bloque.
            if (fs.existsSync(this.path)) { //Verifico si el archivo especificado existe en el sistema de archivos.
                const productsData = await fs.promises.readFile(this.path, 'utf-8'); //Si el archivo existe, leo su contenido y lo grabo.
                this.products = JSON.parse(productsData); //Convierto los datos del archivo en un array de objetos que representan productos.
                // Obtener el último id para continuar la secuencia de ids
                const lastProduct = this.products[this.products.length - 1];
                ProductManager.ultId = lastProduct ? lastProduct.id : 0;
            } else {
                await fs.promises.writeFile(this.path, '[]', 'utf-8');
            }
        } catch (error) {
            console.error("Error initializing ProductManager:", error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("All fields are mandatory..");
                return;
            }
            if (this.products.some(product => product.code === code)) {
                console.log("A product with that code already exists.");
                return;
            }

            const newProduct = {
                id: ++ProductManager.ultId,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            };

            this.products.push(newProduct);
            await this.saveToFile();
            console.log("Product added successfully.");
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    async getProducts() {
        try {
            return this.products;
        } catch (error) {
            console.error("Error getting products:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const product = this.products.find(product => product.id === id);
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
}

async function generateRandomProductsJSON(filename, numProducts) {
    try {
        const products = [];
        for (let i = 1; i <= numProducts; i++) {
            const product = {
                id: i,
                title: `Product ${i}`,
                description: `Description of Product ${i}`,
                price: Math.floor(Math.random() * 100) + 1,
                thumbnail: `path/to/thumbnail_${i}.jpg`,
                code: `P${i}`,
                stock: Math.floor(Math.random() * 100) + 1
            };
            products.push(product);
        }
        await fs.promises.writeFile(filename, JSON.stringify(products, null, 2), 'utf-8');
        console.log(`Generated ${numProducts} products and saved to ${filename}.`);
    } catch (error) {
        console.error("Error generating random products:", error);
    }
}




// Testing:

// 1) Se crea una instancia de la clase "ProductManager"
const TestProductManager = new ProductManager();

// 2) Se llamará "getProducts" inmediatamente después de crear la instancia, debería devolver un arreglo vacío []
console.log(TestProductManager.getProducts());

// 3) Se llamará al método "addProduct" con los siguientes campos:
// title: "producto de muestra"
// description: "Este es un producto prueba"
// price: 200,
// thumbnail: "Sin imagen"
// code: "abc123",
// stock: 25

TestProductManager.addProduct("producto de muestra 1", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

// 4) Se llamará al método "getProducts" nuevamente, esta vez debería aparecer el producto recién agregado
console.log(TestProductManager.getProducts());
TestProductManager.addProduct("producto de muestra 2", "Este es un producto prueba 2", 200, "Sin imagen", "abc124", 50);

// Llamar al método "addProduct" con los mismos campos que arriba, debería arrojar un error porque el código estará repetido.
TestProductManager.addProduct("producto de muestra 3", "Este es un producto prueba 3", 300, "Sin imagen", "abc124", 150);

// 5) Se evaluará que getProductById devuelva un error si no encuentra el producto o devuelva el producto si lo encuentra
TestProductManager.getProductById(2000); // Debería devolver un error porque no hay ningún producto con id 2000
TestProductManager.getProductById(1); // Debería devolver el producto con id 1