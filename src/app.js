const express = require('express');
const fs = require('fs').promises;
const exphbs = require("express-handlebars"); 
const socket = require("socket.io"); 
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

const app = express(); // Creo una nueva instancia de la aplicación express
const PORT = 8080; // Coloco el puerto donde se alojara el servidor

// Middlewares para manejar el formato JSON, datos de formulario y otro para la carpeta estatica de public.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Importación de express-handlebars y configuración
const hbs = exphbs.create({
  defaultLayout: "main",
  helpers: {
    // Puedes definir helpers personalizados aquí si los necesitas
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Permite acceder a propiedades del prototipo
    allowProtoMethodsByDefault: true, // Permite acceder a métodos del prototipo
  },
});

//Configuracion de Handlebars
// Configuro el motor de plantillas Handlebars en Express 
app.engine("handlebars", hbs.engine);
// Establezco Handlebars como el motor de vistas que se utilizará para renderizar las plantillas
app.set("view engine", "handlebars");
// Establezco la ubicación del directorio que contiene las vistas o plantillas a utilizar
app.set("views", "./src/views");

// Coloco las rutas para los endpoints de productos y carrito
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

// Inicio el servidor y escuchar en el puerto definido
const httpServer = app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});


/// Iniciar el servidor de socket.io con el servidor HTTP
const io = socket(httpServer);

//Obtengo el array de productos: 
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    //Envio el array de productos al cliente: 
    socket.emit("productos", await productManager.getProducts());
    
    //Recibo el evento "eliminarProducto" desde el cliente: 
    socket.on("eliminarProducto", async (_id) => {
        try {
            await productManager.deleteProduct(_id);
            //Enviamos el array de productos actualizados: 
            socket.emit("productos", await productManager.getProducts());
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    });

    //Recibo el evento "agregarProducto" desde el cliente: 
    socket.on("agregarProducto", async (producto) => {
        try {
            const { title, description, price, img, code, stock, category, thumbnails } = producto;
            await productManager.addProduct(title, description, price, img, code, stock, category, thumbnails);
            socket.emit("productos", await productManager.getProducts());
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    });
});

// Manejo de mensajes en el chat del ecommerce
const MessageModel = require("./models/message.model.js");

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async (data) => {
        try {
            // Guardo el mensaje en MongoDB
            await MessageModel.create(data); // Corrección aquí

            // Obtengo los mensajes de MongoDB y se los paso al cliente
            const messages = await MessageModel.find();
            socket.emit("message", messages);
        } catch (error) {
            console.error("Error al procesar mensaje:", error);
        }
    });
});
