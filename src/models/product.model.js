// Importo el módulo Mongoose
const mongoose = require("mongoose");
// Importo el módulo mongoose-paginate
const mongoosePaginate = require('mongoose-paginate-v2');

// Definición del esquema del producto
const productSchema = new mongoose.Schema({
    // Título del producto
    title: {
        type: String, // Tipo de dato para el título
        required: true // Campo requerido, debe ser proporcionado al crear un producto
    },

    // Descripción del producto
    description: {
        type: String, 
        required: true 
    },

    // Precio del producto
    price: {
        type: Number, 
        required: true 
    },

    // URL de la imagen del producto
    img: {
        type: String 
    },

    // Código único del producto
    code: {
        type: String, // Tipo de dato para el código
        unique: true, // Debe ser único en la colección
        required: true // Campo requerido, debe ser proporcionado al crear un producto
    },

    // Stock disponible del producto
    stock: {
        type: Number, 
        required: true 
    },

    // Categoría a la que pertenece el producto
    category: {
        type: String, 
        required: true 
    },

    // Estado del producto (activo/inactivo)
    status: {
        type: Boolean, 
        required: true 
    },

    // Lista de URL de miniaturas del producto
    thumbnails: {
        type: [String] 
    },
    
    // Propietario del producto
    owner: {
        type: String, 
        required: true, 
        default: 'admin'
        }
});

//Middleware de pre, se ejecuta antes de realizar una consulta 'paginate' en el esquema de productos
productSchema.pre('paginate', function (next) {
    // Puebla aquí campo 'products.product' del carrito con solo el '_id', 'title' y 'price' del producto asociado
    this.populate('products.product');
     next(); // Llamo a la función next para continuar con la ejecución
 });

// Middleware de post, se ejecuta despues de realizar una consulta 'paginate' en el esquema de productos
productSchema.plugin(mongoosePaginate);

// Creo el modelo "ProductModel" basado en el esquema "productSchema"
const ProductModel = mongoose.model("products", productSchema);

// Exporto el modelo para su uso en otras partes de la aplicación
module.exports = ProductModel;
