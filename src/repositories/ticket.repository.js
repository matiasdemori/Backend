// Importo el modelo de ticket
const TicketModel = require("../models/ticket.model.js");
// Importo la función generateUniqueCode y calcularTotal de cartutils
const { generateUniqueCode, calcularTotal } = require("../utils/cartutils.js");

// Clase TicketRepository, encapsulo los métodos para interactuar con la base de datos de tickets.
class TicketRepository {
    // Crear nuevo ticket
    async crearTicket(cart, user) {
        try {
            // Crear nuevo ticket
            const ticket = new TicketModel({
                code: generateUniqueCode(),  // Genero un código único para el ticket.
                purchase_datetime: new Date(),  // Registro la fecha y hora de la compra.
                amount: calcularTotal(cart.products),  // Calculo el monto total de la compra.
                purchaser: user._id  // Asigno el ID del usuario como comprador.
            });

            // Guardo el ticket en la base de datos.
            await ticket.save(); 
            
            // Retorno el ticket creado.
            return ticket;

        } catch (error) {
            console.error("Error creating ticket", error);
            throw new Error("Error creating ticket");
        }
    }
}

// Exporto la clase
module.exports = TicketRepository;