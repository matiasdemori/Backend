// Importo el módulo Express
const express = require("express");
// Creo un enrutador
const router = express.Router();

// Importo el controlador ViewsController
const ViewsController = require("../controllers/view.controller.js");
// Creo una instancia de ViewController
const viewsController = new ViewsController();

// Middleware para la gestión de autenticación
const checkUserRole = require("../middleware/checkrole.js");

// 1) Rutas para renderizar el carrito
router.get("/carts/:cid", viewsController.renderCart);

// 2) Rutas para renderizar la pagina de inicio de sesión
router.get("/login", viewsController.renderLogin);

// 3) Rutas para renderizar la pagina de registro
router.get("/register", viewsController.renderRegister);

// 4) Rutas que chequea el rol para ir a la pagina de realtimeproducts, donde se pueden cargar productos
router.get("/realtimeproducts", checkUserRole(['admin', 'premium']), viewsController.renderRealTimeProducts);

// 5) Ruta para el chat
router.get("/chat", checkUserRole(['usuario','premium']) ,viewsController.renderChat);

// 6) Ruta para el home
router.get("/", viewsController.renderHome);

// 7) Ruta para ir a la pagina de reseteo de password
router.get("/reset-password", viewsController.renderResetPassword);

// 8) Ruta para ir a la pagina de cambio de password
router.get("/password", viewsController.renderCambioPassword);

// 9) Ruta para ir a la pagina de confirmación de envío de correo
router.get("/confirmacion-envio", viewsController.renderConfirmacion);

// Exportar el enrutador
module.exports = router;
