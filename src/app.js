const express = require('express'); 
const fs = require('fs').promises; 
const productsRouter = require("./routes/products.router.js"); 
const cartsRouter = require("./routes/carts.router.js"); 

const app = express(); // Creo una nueva instancia de la aplicación express
const PORT = 8080; // Coloco el puerto donde se alojara el servidor

// Middlewares para manejar el formato JSON y datos de formulario
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Coloco una ruta de inicio con un mensaje de prueba
app.get("/", (req, res) => {
    res.send("It works!"); 
})

// Coloco las rutas para los endpoints de productos y carrito
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`); 
});
