//Importo el modelo del CartModel 
const CartModel = require("../models/cart.model.js");
const mongoose = require('mongoose');

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
            const existeProducto = carrito.products.find(item => item.product.equals(new mongoose.Types.ObjectId(productId)));

            // Si el producto ya existe en el carrito, incremento la cantidad
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                // Si el producto no existe, lo agrego al carrito con la cantidad especificada
                carrito.products.push({ product: new mongoose.Types.ObjectId(productId), quantity });
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


    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            // Valido que cartId y productId sean cadenas no vacías
            if (!cartId || typeof cartId !== 'string' || !productId || typeof productId !== 'string') {
                throw new Error('Invalid cart or product IDs');
            }

            // Actualizo el carrito en la base de datos usando findOneAndUpdate
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cartId }, // Busco el carrito por su ID
                { $pull: { products: { product: productId } } }, // Elimino el producto correspondiente al productId del array de productos del carrito
                { new: true } // Devuelvo el carrito actualizado después de la operación
            );

            if (!updatedCart) {
                throw new Error('Cart not found');
            }

            return updatedCart; // Devuelvo el carrito actualizado
        } catch (error) {
            console.error('Error when removing the product from the cart in the manager:', error);
            throw error; // Envio el error para manejarlo en un nivel superior
        }
    }


    async actualizarCarrito(cartId, updatedProducts) {
        try {
            // Busco el carrito por su ID en la base de datos
            const cart = await CartModel.findById(cartId);

            // Verifico si el carrito no fue encontrado
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Actualizo los productos del carrito con los nuevos productos proporcionados
            cart.products = updatedProducts;

            // Marco el campo 'products' como modificado para asegurar que se guarde correctamente
            cart.markModified('products');

            // Guardo los cambios en el carrito actualizado en la base de datos
            await cart.save();

            // Devuelvo el carrito actualizado después de la operación
            return cart;
        } catch (error) {
            // Capturo errores en caso de fallo
            console.error('Error updating cart in manager', error);
            throw error; // Envio el error para que sea manejado por el código que llama a esta función
        }
    }


    async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
        try {
            // Busco el carrito por su ID en la base de datos
            const cart = await CartModel.findById(cartId);

            // Verifico si el carrito no fue encontrado
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Busco el índice del producto en el array de productos del carrito
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            // Verifico si el producto fue encontrado en el carrito
            if (productIndex !== -1) {
                // Actualizo la cantidad del producto en el carrito
                cart.products[productIndex].quantity = newQuantity;

                // Marco el campo 'products' como modificado para asegurar que se guarde correctamente
                cart.markModified('products');

                // Guardo los cambios en el carrito actualizado en la base de datos
                await cart.save();

                // Devuelvo el carrito actualizado después de la operación
                return cart;
            } else {
                // Si el producto no fue encontrado en el carrito, envio un error
                throw new Error('Product not found in cart');
            }
        } catch (error) {
            // Capturo errores en caso de fallo
            console.error('Error updating the quantity of the product in the cart', error);
            throw error; // Envio el error para que sea manejado por el código que llama a esta función
        }
    }


    async vaciarCarrito(cartId) {
        try {
            // Busco y actualizo el carrito por su ID, estableciendo el campo 'products' como un array vacío
            const cart = await CartModel.findByIdAndUpdate(
                cartId, // ID del carrito a actualizar
                { products: [] }, // Establezco el campo 'products' como un array vacío
                { new: true } // Devuelvo el carrito actualizado después de la operación
            );

            // Verifico si el carrito no fue encontrado
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Devuelvo el carrito actualizado después de vaciarlo
            return cart;
        } catch (error) {
            // Capturo errores en caso de fallo
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error; // Envio el error para que sea manejado por el código que llama a esta función
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
