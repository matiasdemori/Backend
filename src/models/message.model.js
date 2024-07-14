// Importo el módulo Mongoose
const mongoose = require("mongoose");

// Definio el esquema del mensaje
const messageSchema = new mongoose.Schema({
    // Usuario que envía el mensaje
    user: {
        type: String, // Tipo de dato para el nombre de usuario
        required: true // Campo requerido
    },
    
    // Contenido del mensaje
    message: {
        type: String, // Tipo de dato para el contenido del mensaje
        required: true // Campo requerido
    }
});

// Creo el modelo "MessageModel" basado en el esquema "messageSchema"
const MessageModel = mongoose.model("messages", messageSchema);

// Exporto el modelo para su uso en otras partes de la aplicación
module.exports = MessageModel;
