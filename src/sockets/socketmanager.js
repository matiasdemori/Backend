// Importo el modulo de socket.io
const socket = require("socket.io");

// Importo el repositorio de Product
const ProductRepository = require("../repositories/product.repository.js");
// Genero una instancia de ProductRepository
const productRepository = new ProductRepository(); 
// Importo el modelo de Mensaje
const MessageModel = require("../models/message.model.js");

// Genero la clase SocketManager
class SocketManager {
    // Inicializo el servidor de socket.io
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    // Genero el metodo initSocketEvents
    async initSocketEvents() {
        // Escucho el evento "connection"
        this.io.on("connection", async (socket) => {
            // Imprimo en consola que un cliente se conectó
            console.log("Un cliente se conectó");
            
            // Envio el array de productos
            socket.emit("productos", await productRepository.getProducts() );

            // Escucho el evento "eliminarProducto"
            socket.on("eliminarProducto", async (id) => {
                // Elimino el producto
                await productRepository.deleteProduct(id);
                // Envio el array de productos actualizado
                this.emitUpdatedProducts(socket);
            });

            // Escucho el evento "agregarProducto"
            socket.on("agregarProducto", async (producto) => {
                // Agrego el nuevo producto
                await productRepository.addProduct(producto);
                // Imprimo en consola el nuevo producto
                console.log(producto);
                // Envio el array de productos actualizado
                this.emitUpdatedProducts(socket);
            });

            // Escucho el evento "message"
            socket.on("message", async (data) => {
                // Guardo el mensaje en MongoDB
                await MessageModel.create(data);
                // Obtengo los mensajes de MongoDB y se los paso al cliente
                const messages = await MessageModel.find();
                // Imprimo en consola el nuevo mensaje
                socket.emit("message", messages);
            });
        });
    }

    // Genero el metodo emitUpdatedProducts
    async emitUpdatedProducts(socket) {
        // Envio el array de productos actualizado
        socket.emit("productos", await productRepository.getProducts());
    }
}

module.exports = SocketManager;