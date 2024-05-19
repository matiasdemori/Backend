// Importo el módulo Mongoose
const mongoose = require("mongoose");

// Creo un nuevo esquema de usuario utilizando mongoose.Schema
const userSchema = mongoose.Schema({
    // Campo para el primer nombre del usuario
    first_name: {
        type: String, // Tipo de datos: String
        required: true // Campo obligatorio
    },

    // Campo para el apellido del usuario
    last_name: {
        type: String, 
        required: true
    },

    // Campo para el email del usuario
    email: {
        type: String, 
        required: true, 
        index: true, // Índice para mejorar la búsqueda
        unique: true // Valor único para cada usuario
    },

    // Campo para la contraseña del usuario
    password: {
        type: String, 
        required: true 
    },

    // Campo para la edad del usuario
    age: {
        type: Number, 
        required: true 
    },

    // Campo para el rol del usuario
    role: {
        type: String, 
        enum: ['admin', 'usuario'], // Valores permitidos: 'admin', 'usuario'
        default: 'usuario' // Valor por defecto: 'usuario'
    }
});

// Creo el modelo de usuario utilizando el esquema definido
const UserModel = mongoose.model("user", userSchema);

// Exporto el modelo de usuario para su uso en otras partes de la aplicación
module.exports = UserModel;
