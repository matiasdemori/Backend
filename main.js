/** AFTER 1 - PRIMER DESAFIO ENTREGABLE **/

class ProductManager {
    static ultId = 0;
    constructor() {
        // Inicialización del arreglo de productos y el contador de id
        this.products = [];
        //Inicializo una variable estatica donde guardare el ultimo ID Asignado: 
        }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Valido que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("All fields are mandatory..");
            return;
        }
        // Valido que no se repita el campo "code"
        if (this.products.some(product => product.code === code)) {
            console.log("A product with that code already exists.");
            return;
        }

    // Creo un nuevo objeto con un id autoincrementable
    const newProduct = {
        id: ++ProductManager.ultId, 
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock
    };

    // Agrego el nuevo producto al arreglo de productos
    this.products.push(newProduct);
    console.log("Product added successfully.");
}


getProducts() {
    // Devuelve el arreglo de productos
    return this.products;
}

getProductById(id) {
    // Busca un producto por su id en el arreglo de productos
    const product = this.products.find(product => product.id === id);
    if (product) {
        // Si encuentra el producto, lo devuelve
        console.log("Product found" , product);;
    } else {
        // Si no se encuentra, muestra un mensaje de error
        console.log("not found.");
    }
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