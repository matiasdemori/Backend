// Importo express
const express = require('express');
// Importo el módulo express-handlebars
const exphbs = require("express-handlebars"); 
// Importo el modulo de sesiones
const session = require("express-session");
// Importo el modulo de Mongo
const MongoStore = require("connect-mongo");
// Importo el modulo passport
const passport = require("passport");
// Importo el modulo de cookie parser
const cookieParser = require("cookie-parser");
// Importo la conexion a la base de datos
require("./database.js");
// Importo el modulo de cors
const cors = require("cors");
// Importo el modulo de path
const path = require('path');

// Creo una nueva instancia de la aplicación express
const app = express();
// Coloco el puerto donde se alojara el servidor
const PORT = 8080; 

// Middleware de sesiones en Express
app.use(session({
    // Clave secreta utilizada para firmar las cookies de sesión
    secret: "secretCoder",
    // Vuelvo a guardar la sesión incluso si no ha cambiado durante la solicitud
    resave: true,
    // Guardo una nueva sesión aunque no esté inicializada
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://matiasdemori:coderhouse@cluster0.crxzscd.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}));

// Middleware para la gestión de cookies
app.use(cookieParser());

// Importo la configuración de Passport
const initializePassport = require("./config/passport.config.js");

// CONFIGURACION DE PASSPORT
// Inicializo Passport y su middleware 
app.use(passport.initialize());
// Middleware para la gestión de sesiones de Passport
app.use(passport.session());
// Inicializo las estrategias de autenticación de Passport
initializePassport(); 

//MIDDLEWARES
// Middlewares para manejar el formato JSON
app.use(express.json());
// Middlewares para manejar el formato URL-encoded
app.use(express.urlencoded({ extended: true }));
// Middlewares para la carpeta estatica de public
app.use(express.static(path.join(__dirname, 'public')));
// Middleware para la configuración de CORS
app.use(cors());

// MIDDLEWARES DE AUTENTICACIÓN
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

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

// CONFIGURACIÓN DE HANDLEBARS
// Configuro el motor de plantillas Handlebars en Express 
app.engine("handlebars", hbs.engine);
// Establezco Handlebars como el motor de vistas que se utilizará para renderizar las plantillas
app.set("view engine", "handlebars");
// Establezco la ubicación del directorio que contiene las vistas o plantillas a utilizar
app.set("views", "./src/views");

// Importo las rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js");

// RUTAS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

// CONFIGURACIÓN DEL SERVIDOR
// Inicio el servidor y escuchar en el puerto definido
const httpServer = app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});

// CONFIGURACIÓN DE WEBSOCKET 
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
