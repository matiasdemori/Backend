// Importo el módulo express para la creación de rutas
const express = require("express");

// Creo un nuevo enrutador utilizando express.Router()
const router = express.Router();

// Importa el modelo de usuario 
const UserModel = require("../models/user.model.js");

// Importa la función createHash 
const { createHash } = require("../utils/hashbcryp.js");

router.post("/", async (req, res) => {
    // Ruta POST para manejar la creación de usuarios
    const { first_name, last_name, email, password, age } = req.body;

    try {
        // Verifico si el correo electrónico ya está registrado en la base de datos
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ error: "Email is already registered" });
        }

        // Hashea la contraseña antes de crear el nuevo usuario
        const hashedPassword = await createHash(password);

        // Defino el rol del usuario (puede ser "admin" o "usuario" dependiendo del correo electrónico)
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'usuario';

        // Creo un nuevo usuario en la base de datos utilizando UserModel.create
        const newUser = await UserModel.create({ first_name, last_name, email, password: hashedPassword, age, role });
        // Almaceno información del usuario en la sesión para mantenerlo autenticado
        req.session.login = true;
        req.session.user = { ...newUser._doc };

        // Redirijo al usuario a la página de productos después de crear la cuenta exitosamente
        res.redirect("/products");

    } catch (error) {
        // Manejo cualquier error que pueda ocurrir durante la creación del usuario
        console.error("Error al crear el usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});

module.exports = router; 