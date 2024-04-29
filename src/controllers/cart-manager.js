//Importo el modelo del CartModel 
const CartModel = require("../models/cart.model.js");

//Defino unca clase llamada CartManager, que contendrá métodos para gestionar y manipular los carritos en la aplicación.
class CartManager {

    //Defino un método asincrónico crearCarrito para crear un nuevo carrito.
    async crearCarrito() {
        //Bloque try para manejar errores potenciales durante la ejecución del código dentro de este bloque
        try {
            //Products comienza como un arreglo vacío.
            const nuevoCarrito = new CartModel({ products: [] });
            //Guardo el nuevo carrito en la base de datos utilizando el método save
            await nuevoCarrito.save();
            console.log("Cart saved successfully");
            return nuevoCarrito;

        //Manejo errores en caso de que ocurra algún problema al crear el carrito
        } catch (error) {
            console.log("Error creating a new cart", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            // Valido que el ID sea un formato válido antes de buscar el carrito
            if (!cartId || typeof cartId !== 'string') {
                throw new Error("Invalid cart ID. The ID must be a non-empty string.");
            }
    
            // Busco el carrito en la base de datos por su ID
            const carrito = await CartModel.findById(cartId);
    
            // Verifico si el carrito no fue encontrado
            if (!carrito) {
                console.log("There is no cart with that ID");
                return null;
            }
    
            // Retorno el carrito encontrado
            return carrito;

        } catch (error) {
            // Manejo errores
            if (error instanceof Error) {
                console.log("Error getting a cart by ID:", error.message);
            } else {
                console.log("Unknown error getting a cart by ID");
            }
            // Lanzo nuevamente el error para que sea manejado por bloques superiores o el sistema en general
            throw error;
        }
    }


    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            // Obtengo el carrito por su ID
            const carrito = await this.getCarritoById(cartId);
    
            // Verifico si el producto ya existe en el carrito
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);
    
            // Si el producto ya existe en el carrito, incremento la cantidad
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                // Si el producto no existe, lo agrego al carrito con la cantidad especificada
                carrito.products.push({ product: productId, quantity });
            }
    
            // Marco la propiedad "products" como modificada
            carrito.markModified("products");
    
            // Guardo los cambios en el carrito en la base de datos
            await carrito.save();
    
            // Retorno el carrito actualizado
            return carrito;
    
        } catch (error) {
            // Manejo errores en caso de que ocurra algún problema al agregar un producto al carrito
            console.log("Error adding a product", error);
            throw error;
        }
    }
    
}

module.exports = CartManager;





// DEJO COMENTADO EL CODIGO REALIZADO CON FILESYSTEM PARA CUANDO UTILICE DOT.


// const fs = require("fs").promises;

// class CartManager {
//     constructor(path) {
//         this.carts = [];
//         this.path = path;
//         this.ultId = 0;

//         // Cargo los carritos existentes desde el archivo al inicializar la clase
//         this.cargarCarritos();
//     }

//     // Cargo los carritos existentes en el archivo
//     async cargarCarritos() {
//         try {
//             // Leo los datos del archivo
//             const data = await fs.readFile(this.path, "utf-8");
//             // Parseo los datos JSON para obtener un array de objetos carrito
//             this.carts = JSON.parse(data);

//             // Verifico si hay al menos un carrito creado
//             if (this.carts.length > 0) {
//                 // Busco el ID máximo entre los carritos existentes
//                 this.ultId = Math.max(...this.carts.map(cart => cart.id));
//                 // Creo un nuevo array que contiene solo los IDs de los carritos existentes.
//                 // Busco el valor máximo dentro del array de IDs. El operador de propagación ... se usa para pasar los elementos del array como argumentos separados a Math.max.
//             }
//         } catch (error) {
//             // Capturo el error si es que hay y lo muestro por consola
//             console.error("Error al crear los carritos:", error);
//             // Si el archivo no existe o está vacío, se crea uno nuevo llamando al método saveCarts
//             await this.cargarCarritos();
//         }
//     }

//     // Guardar los carritos en el archivo
//     async guardarCarritos() {
//         try {
//             // Escribo los carritos en el archivo en formato JSON con formato legible (2 espacios de indentación)
//             await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
//             console.log("Carts saved successfully.");
//         } catch (error) {
//             // Capturo e informo el error
//             console.error("Error saving carts:", error);
//         }
//     }

//     // Crear un nuevo carrito
//     async crearCarrito() {
//         try {
//             // Creo un objeto para el nuevo carrito con un ID único y un array vacío de productos.
//             const newCart = {
//                 id: ++this.ultId, // Incremento el último ID utilizado.
//                 products: [] // Inicializo el array de productos del nuevo carrito.
//             };

//             this.carts.push(newCart); // Agrego el nuevo carrito al array de carritos.

//             // Guardo el array actualizado en el archivo
//             await this.guardarCarritos();

//             console.log("Cart created successfully.");
//             return newCart; // Devuelvo el nuevo carrito creado
//         } catch (error) {
//             console.error("Error creating cart:", error);
//             throw error; // Relanzo el error para capturarlo en la llamada a esta función
//         }
//     }


//     // Obtener carrito por ID
//     async getCarritoById(cartId) {
//         try {
//             // Busco el carrito con el ID proporcionado en la lista de carritos
//             const cart = this.carts.find(c => c.id === cartId);

//             // Verifico si no se encontró ningún carrito con ese ID
//             if (!cart) {
//                 console.log("No cart found with that ID.");
//                 return; // Sino se encontro arrojo el motivo
//             }

//             return cart; // Sino devuelvo el carrito encontrado
//         } catch (error) {
//             console.error("Error getting cart by ID:", error);
//             throw error; // Relanzo el error para capturarlo en la llamada a esta función
//         }
//     }

//     // Agregar producto al carrito
//     async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
//         try {
//             // Obtengo el carrito por su ID
//             const cart = await this.getCarritoById(cartId);

//             // Verifico si el carrito no se encontró
//             if (!cart) {
//                 throw new Error("Cart not found.");
//             }

//             // Busco si el producto ya existe en el carrito
//             const existingProduct = cart.products.find(p => p.product === productId);

//             // Si el producto ya existe, incremento la cantidad del producto
//             if (existingProduct) {
//                 existingProduct.quantity += quantity;
//             } else {
//                 // Si el producto no existe, agregarlo al carrito
//                 cart.products.push({ product: productId, quantity });
//             }

//             // Guardo el carrito actualizado en el archivo
//             await this.guardarCarritos();

//             console.log("Product added to cart successfully.");
//             return cart; // Devolvo el carrito actualizado
//         } catch (error) {
//             console.error("Error adding product to cart:", error);
//             throw error; // Relanzo el error para capturarlo en la llamada a esta función
//         }
//     }
// }


// module.exports = CartManager;
