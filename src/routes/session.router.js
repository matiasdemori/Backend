// Importo el módulo express para la creación de las rutas
const express = require("express");

// Creo un nuevo enrutador utilizando express.Router()
const router = express.Router();

// Importo el modelo de usuario
const UserModel = require("../models/user.model.js");
// Importo la función isValidPassword 
const { isValidPassword } = require("../utils/hashbcryp.js");

const passport = require("passport"); 

// Versión para Passport (inicio de sesión local)
router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin" // Redirijo en caso de autenticación fallida
}), async (req, res) => {
    if (!req.user) { // Compruebo si el usuario no está autenticado
        return res.status(400).send("Credenciales invalidas"); // Envío un mensaje de error si las credenciales son inválidas
    }

    // Establezco las variables de sesión con los datos del usuario autenticado
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true; // Establezco la sesión como iniciada
    res.redirect("/profile"); // Redirijo al usuario a la página de perfil
});

// Enrutador para manejar la falla en el inicio de sesión
router.get("/faillogin", async (req, res) => {
    res.send("Error en en login"); // Envío un mensaje de error en caso de falla en el inicio de sesión
});

// Versión para GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

// Enrutador para manejar la respuesta de GitHub después de la autorización
router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login" // Redirijo en caso de autenticación fallida
}), async (req, res) => {
    // La estrategia de Github retorna el usuario, entonces los agrego a mi objeto de Session
    req.session.user = req.user; // Establezco las variables de sesión con los datos del usuario autenticado
    req.session.login = true; // Establezco la sesión como iniciada
    res.redirect("/profile"); // Redirijo al usuario a la página de perfil
});

// Logout:
// Ruta GET para manejar la salida de los usuarios
router.get("/logout", (req, res) => {
    // Obtengo el nombre del usuario desde la sesión
    const userName = req.session.user ? req.session.user.first_name : "Usuario";

    // Destruyo la sesión
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }

        // Renderizo la vista de logout con el nombre del usuario
        res.render("logout", { user: { name: userName } });
    });
});

module.exports = router; // Exporto el enrutador

// //Login: 
// // Ruta POST para manejar el inicio de sesión de los usuarios
// router.post("/login", async (req, res) => {
//     // Obtengo el email y la contraseña del cuerpo de la solicitud
//     const { email, password } = req.body;
//     try {
//         // Busco un usuario en la base de datos por su email
//         const usuario = await UserModel.findOne({ email: email });
//         if (usuario) {
//             // Verifico si la contraseña proporcionada es válida usando isValidPassword
//             if (isValidPassword(password, usuario)) {
//                 // Establezco las variables de sesión para el usuario autenticado
//                 req.session.login = true;
//                 req.session.user = {
//                     email: usuario.email,
//                     age: usuario.age,
//                     first_name: usuario.first_name,
//                     last_name: usuario.last_name,
//                     role: usuario.role
//                 };
//                 // Redirijo al usuario a la página de productos después del inicio de sesión exitoso
//                 res.redirect("/products");
//             } else {
//                 // Si la contraseña no es válida, devuelve un error 401
//                 res.status(401).send({ error: "Invalid password" });
//             }
//         } else {
//             // Si no se encuentra el usuario, devuelve un error 404
//             res.status(404).send({ error: "User not found" });
//         }
//     } catch (error) {
//         // Maneja cualquier error que pueda ocurrir durante el inicio de sesión
//         res.status(400).send({ error: "Login error" });
//     }
// });