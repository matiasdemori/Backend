// Importo el módulo Mongoose
const mongoose = require('mongoose');

// Defino el esquema del ticket
const ticketSchema = new mongoose.Schema({
    // Código del ticket
    code: {
        type: String,
        unique: true,
        required: true
    },

    // Fecha de compra del ticket
    purchase_datetime: {
        type: Date,
        default: Date.now, // Valor predeterminado de la fecha de compra
        required: true
    },

    // Monto total del ticket
    amount: {
        type: Number,
        required: true
    },

    // ID del usuario que compra el ticket
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Middleware de pre, se ejecuta antes de realizar una consulta 'findOne' en el esquema de ticket
ticketSchema.pre('findOne', function (next) {
    // Puebla aquí el campo 'purchaser' del ticket con solo el '_id' del usuario asociado
    this.populate('purchaser');
    next(); // Llamo a la función next para continuar con la ejecución
});

// Creo el modelo "TicketModel" basado en el esquema "ticketSchema"
const TicketModel = mongoose.model('Ticket', ticketSchema);

// Exporto el modelo para su uso en otras partes de la aplicación
module.exports = TicketModel;