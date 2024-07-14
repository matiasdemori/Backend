// Importo el módulo express para la creación de rutas
const express = require("express");
// Creo un nuevo enrutador utilizando express.Router()
const router = express.Router();

// Importo userController
const UserController = require("../controllers/user.controller.js");
// Genero una instancia de userController
const userController = new UserController();

// Importo passport
const passport = require("passport");

// 1) Ruta para registrar un usuario
router.post("/register", userController.register);

// 2) Ruta para iniciar sesión
router.post("/login", userController.login);

// 3) Ruta para obtener el perfil del usuario
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);

// 4) Ruta para cerrar la sesión
router.post("/logout", userController.logout.bind(userController));

// 5) Ruta para obtener el rol del usuario
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);

// 6) Ruta para solicitar un cambio de contraseña de usuario
router.post("/requestPasswordReset", userController.requestPasswordReset);

// 7) Ruta para restablecer la contraseña de usuario
router.post('/reset-password', userController.resetPassword);

// 8) Ruta para cambiar el rol de usuario
router.put("/premium/:uid", userController.cambiarRolPremium);

// Exportar el enrutador para su uso en la aplicación principal
module.exports = router;