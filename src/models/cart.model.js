const mongoose = require("mongoose");

// Defino el esquema del carrito
const cartSchema = new mongoose.Schema({
    // Array de productos en el carrito
    products: [
        {
            // Producto en el carrito referenciado por su ID en la colección "Product"
            product: {
                type: mongoose.Schema.Types.ObjectId, // Tipo de dato para el ID del producto
                ref: "Product", // Referencia al modelo "Product"
                required: true // Campo requerido
            },
            // Cantidad del producto en el carrito
            quantity: {
                type: Number, // Tipo de dato 
                required: true // Campo requerido
            }
        }
    ]
});

// Creo el modelo "CartModel" basado en el esquema "cartSchema"
const CartModel = mongoose.model("carts", cartSchema);

// Exporto el modelo para su uso en otras partes de la aplicación
module.exports = CartModel;
