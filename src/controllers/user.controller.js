// Importo el repositorio de User
const UserRepository = require("../repositories/user.repository.js");
// Genero una instancia de UserRepository
const userRepository = new UserRepository();
// Importo el servicio de Email
const EmailManager = require("../services/email.js");
// Genero una instancia de EmailManager
const emailManager = new EmailManager();
// Importo el servicio jwt
const jwt = require("jsonwebtoken");
// Importo la función createHash y isValidPassword
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
// Importo el dto UserDTO
const UserDTO = require("../dto/user.dto.js");
// Importo la función generateResetToken
const { generateResetToken } = require("../utils/tokenreset.js");

class UserController {
    // Registrar un usuario
    async register(req, res) {
        // Obtengo los datos del cuerpo de la petición
        const datosUsuario = req.body;
        const { first_name, last_name, email, password, age } = datosUsuario;

        try {
            // Verifico si el usuario ya existe con la función findByEmail del repositorio
            const existeUsuario = await userRepository.findByEmail({ email });
            // Si el usuario ya existe, devuelvo un error 400
            if (existeUsuario) {
                return res.status(400).send("The user already exists");
            }

            // Creo un nuevo usuario:
            const nuevoUsuario = await userRepository.crearUsuario({
                first_name,
                last_name,
                email,
                cart,
                password,
                age
            });

            // Si se crea el usuario, envio mensaje de confirmación
            if (nuevoUsuario) {
                res.send("User created successfully");
            } else {
                res.status(500).send("Error creating user");
            }

            // Genero un token de autenticación
            const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
                expiresIn: "1h"
            });

            // Envio el token de autenticación al cliente
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            // Redirijo a la página de profile
            res.redirect("/api/users/profile");

        } catch (error) {
            // En caso de error, devuelvo un error 500 y el error en la consola
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    // Inicio de sesión
    async login(req, res) {
        // Obtengo los datos del cuerpo de la petición
        const { email, password } = req.body;
        try {
            // Busco al usuario en la base de datos
            const usuarioEncontrado = await UserRepository.findByEmail({ email });

            // Si el usuario no existe, devuelvo un error 401
            if (!usuarioEncontrado) {
                return res.status(401).send("Usuario no válido");
            }

            // Verifico si la contraseña proporcionada es válida
            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                return res.status(401).send("Contraseña incorrecta");
            }

            // Genero un token de autenticación
            const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
                expiresIn: "1h"
            });

            // Envio el token de autenticación al cliente
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            // Redirijo a la página de profile
            res.redirect("/api/users/profile");

        } catch (error) {
            // En caso de error, devuelvo un error 500 y el error en la consola
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    // Perfil de usuario y rol
    async profile(req, res) {
        try {
            // Si el usuario no es admin, es premium
            const isPremium = req.user.role === 'premium';

            // Utilizo la clase UserDTO para crear un objeto de usuario
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);

            // Si el usuario es admin, es admin
            const isAdmin = req.user.role === 'admin';

            // Renderizo la vista profile con los datos del usuario
            res.render("profile", { user: userDto, isPremium, isAdmin });

        } catch (error) {
            res.status(500).send('Error interno del servidor');
        }
    }

    // Cierre de sesión
    async logout(req, res) {
        // Destruyo la sesión
        res.clearCookie("coderCookieToken");

        // Redirijo a la página de login
        res.redirect("/login");
    }

    // Verifico si el usuario es admin para poder acceder a esta ruta
    async admin(req, res) {
        if (req.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }

    // Restablecer contraseña de usuario por correo electrónico
    async requestPasswordReset(req, res) {
        // Obtengo el correo electrónico del usuario
        const { email } = req.body;

        try {
            // Busco al usuario por su correo electrónico
            const user = await UserRepository.findByEmail({ email });

            // Si el usuario no existe, devuelvo un error 404
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Genero un token 
            const token = generateResetToken();

            // Guardo el token en el usuario
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };
            await user.save();

            // Envio un correo electrónico con el enlace de restablecimiento utilizando EmailService
            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            // Redirijo a la página de confirmación de correo de restablecimiento
            res.redirect("/confirmacion-envio");

        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    // Restablecer contraseña de usuario por token
    async resetPassword(req, res) {
        // Obtengo el token y la nueva contraseña
        const { email, password, token } = req.body;

        try {
            // Busco al usuario por su correo electrónico
            const user = await UserRepository.findByEmail({ email });

            // Si el usuario no existe, devuelvo un error 404
            if (!user) {
                return res.render("passwordcambio", { error: "Usuario no encontrado" });
            }

            // Obtengo el token de restablecimiento de la contraseña del usuario
            const resetToken = user.resetToken;

            // Si el token no coincide, devuelvo un error 404
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            // Verifico si el token ha expirado
            const now = new Date();

            // Si el token ha expirado, redirijo a la página de generación de nuevo correo de restablecimiento
            if (now > resetToken.expiresAt) {
                // Redirigir a la página de generación de nuevo correo de restablecimiento
                return res.redirect("/passwordcambio");
            }

            // Verifico si la nueva contraseña es igual a la anterior
            if (isValidPassword(password, user)) {
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            // Actualizo la contraseña del usuario
            user.password = createHash(password);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save();

            // Renderizo la vista de confirmación de cambio de contraseña
            return res.redirect("/login");

        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }

    // Cambio de rol de usuario a premium o viceversa
    async cambiarRolPremium(req, res) {
        try {
            // Obtengo el ID del usuario a cambiar de rol
            const { uid } = req.params;

            // Busco al usuario por su ID
            const user = await userRepository.findById(uid);

            // Si el usuario no existe, devuelvo un error 404
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Cambio el rol del usuario
            const nuevoRol = user.role === 'usuario' ? 'premium' : 'usuario';

            // Actualizo el rol del usuario
            const actualizado = await userRepository.updateRole(uid, { role: nuevoRol }, { new: true });

            // Devuelvo el usuario actualizado
            res.json(actualizado);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

// Exporto el controlador para su uso en otros módulos
module.exports = UserController;