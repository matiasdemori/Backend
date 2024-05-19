// Importo el módulo express para la creación de las rutas
const express = require("express");

// Creo un nuevo enrutador utilizando express.Router()
const router = express.Router();

// Importo el modelo de usuario
const UserModel = require("../models/user.model.js");
// Importo la función isValidPassword 
const { isValidPassword } = require("../utils/hashbcryp.js");

//Login: 
// Ruta POST para manejar el inicio de sesión de los usuarios
router.post("/login", async (req, res) => {
    // Obtengo el email y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;
    try {
        // Busco un usuario en la base de datos por su email
        const usuario = await UserModel.findOne({ email: email });
        if (usuario) {
            // Verifico si la contraseña proporcionada es válida usando isValidPassword
            if (isValidPassword(password, usuario)) {
                // Establesco las variables de sesión para el usuario autenticado
                req.session.login = true;
                req.session.user = {
                    email: usuario.email,
                    age: usuario.age,
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                    role: usuario.role
                };
                // Redirijo al usuario a la página de productos después del inicio de sesión exitoso
                res.redirect("/products");
            } else {
                // Si la contraseña no es válida, devuelve un error 401
                res.status(401).send({ error: "Invalid password" });
            }
        } else {
            // Si no se encuentra el usuario, devuelve un error 404
            res.status(404).send({ error: "User not found" });
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el inicio de sesión
        res.status(400).send({ error: "Login error" });
    }
});

//Logout: 
// Ruta GET para manejar la salida de los usuarios
router.get("/logout", (req, res) => {
    // Verifico si el usuario está autenticado antes de destruir la sesión
    if (req.session.login) {
        req.session.destroy();
    }
    // Redirijo al usuario a la página de inicio de sesión después de salir
    res.redirect("/login");
});

module.exports = router; 
