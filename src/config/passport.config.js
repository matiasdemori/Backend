// Importo el módulo passport, un middleware de autenticación
const passport = require("passport");
// Importo el módulo passport-local, que proporciona la estrategia de autenticación local
const local = require("passport-local");
// Importa el módulo passport-github2, que proporciona la estrategia de autenticación con GitHub 
const GitHubStrategy = require("passport-github2");

// Importo el modelo de Usuario y las funciones para el hash de contraseñas
const UsuarioModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

// Defino la estrategia local de autenticación
const LocalStrategy = local.Strategy;

// Creo unca función para inicializar Passport y configurar las estrategias de registro, inicio de sesión y GitHub
const initializePassport = () => {
    // Estrategia de registro de usuarios
    passport.use("register", new LocalStrategy({
        passReqToCallback: true, // Permite acceder al objeto request en el callback
        usernameField: "email" // Campo del formulario que contiene el email
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let usuario = await UsuarioModel.findOne({ email });

            if (usuario) {
                return done(null, false); // Usuario ya registrado
            }

            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password) // Creación de hash para la contraseña
            }

            let resultado = await UsuarioModel.create(nuevoUsuario);
            return done(null, resultado); // Registro exitoso
        } catch (error) {
            return done(error); // Error durante el registro
        }
    }))

    // Estrategia de inicio de sesión
    passport.use("login", new LocalStrategy({
        usernameField: "email" // Campo del formulario que contiene el email
    }, async (email, password, done) => {
        try {
            let usuario = await UsuarioModel.findOne({ email });

            if (!usuario) {
                return done(null, false); // Usuario no encontrado
            }

            if (!isValidPassword(password, usuario)) {
                return done(null, false); // Contraseña incorrecta
            }

            return done(null, usuario); // Inicio de sesión exitoso
        } catch (error) {
            return done(error); // Error durante el inicio de sesión
        }
    }))

    // Serialización y deserialización de usuarios
    passport.serializeUser((user, done) => {
        done(null, user._id); // Guarda el ID del usuario en la sesión
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UsuarioModel.findById({ _id: id });
        done(null, user); // Recupera el usuario de la sesión
    })

    // Estrategia de autenticación con GitHub
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23lijVXA0rHV0KAnd1",
        clientSecret: "5109938d56283b88daf25cbc3fc350b9b2a28d9b",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile); // Muestra los datos del perfil de GitHub

        try {
            let usuario = await UsuarioModel.findOne({ email: profile._json.email });

            if (!usuario) {
                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 36,
                    email: profile._json.email,
                    password: "1234" // Contraseña temporal para usuarios de GitHub
                }

                let resultado = await UsuarioModel.create(nuevoUsuario);
                done(null, resultado); // Usuario de GitHub creado
            } else {
                done(null, usuario); // Usuario de GitHub ya existente
            }
        } catch (error) {
            return done(error); // Error durante la autenticación con GitHub
        }
    }))
}

module.exports = initializePassport;// Exporta la función para inicializar Passport
