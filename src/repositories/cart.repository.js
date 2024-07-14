//Importo el modelo del CartModel
const CartModel = require("../models/cart.model.js");

//Defino unca clase llamada CartManager, que contendrá métodos para gestionar y manipular los carritos en la aplicación.
class CartRepository {

    //Defino un método crearCarrito para crear un nuevo carrito.
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
            throw new Error("Error"); //Lanzo el error;
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
            throw new Error("Error"); // Lanzo el error;
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
            throw error; // Envio el error
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

module.exports = CartRepository;