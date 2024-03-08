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
                await fs.promises.writeFile(this.path, '[]', 'utf-8'); //Creo un archivo vacío en la ubicación especificada por path si el archivo no existe.
            }
        } catch (error) {
            console.error("Error initializing ProductManager:", error);
        }
    }

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
            await fs.promises.appendFile(this.path, JSON.stringify(newProduct) + '\n', 'utf-8');
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
            const index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...updatedFields };
                await fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
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
            const index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                this.products.splice(index, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
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

// 1) Se crea una instancia de la clase "ProductManager"
const productManager = new ProductManager('productos.json');

// 2) Se llamará "getProducts" inmediatamente después de crear la instancia, debería devolver un arreglo vacío []
const initialProducts = await productManager.getProducts();
console.log("Test 1 - getProducts inicial:", initialProducts);

// 3) Se llamará al método "addProduct" con los siguientes campos:
await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log("Producto agregado.");

TestProductManager.addProduct("producto de muestra 1", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

// 4) El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
const updatedProducts = await productManager.getProducts();
console.log("Test 3 - getProducts luego de agregar producto:", updatedProducts);

// 5) Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
const productId = updatedProducts[0].id; // Suponiendo que el producto agregado es el primer elemento del array
const productById = await productManager.getProductById(productId);
console.log("Test 4 - getProductById:", productById);

// 6) Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
async function testUpdateProduct() {
    console.log("Test Update Product:");

    // Agregar un producto para actualizar
    await productManager.addProduct("Producto A", "Descripción A", 100, "imagen1.jpg", "ABC123", 50);

    // Obtener el ID del producto agregado
    const products = await productManager.getProducts();
    const productId = products[0].id;

    // Actualizar el producto
    await productManager.updateProduct(productId, { price: 150 }); // Actualizar el precio

    // Verificar si el producto se actualizó correctamente
    const updatedProduct = await productManager.getProductById(productId);
    if (updatedProduct.price === 150) {
        console.log("Producto actualizado correctamente.");
    } else {
        console.log("Error: No se pudo actualizar el producto.");
    }
}
testUpdateProduct();

// 7) Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
// Test para deleteProduct
async function testDeleteProduct() {
    console.log("\nTest Delete Product:");

    // Agregar un producto para eliminar
    await productManager.addProduct("Producto B", "Descripción B", 200, "imagen2.jpg", "DEF456", 30);

    // Obtener el ID del producto agregado
    const products = await productManager.getProducts();
    const productId = products[0].id;

    // Eliminar el producto
    await productManager.deleteProduct(productId);

    // Verificar si el producto se eliminó correctamente
    const deletedProduct = await productManager.getProductById(productId);
    if (!deletedProduct) {
        console.log("Producto eliminado correctamente.");
    } else {
        console.log("Error: No se pudo eliminar el producto.");
    }
}

testDeleteProduct();