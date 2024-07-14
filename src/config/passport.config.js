// Importo el módulo passport, un middleware de autenticación
const passport = require("passport");

// Importo el módulo passport-local, que proporciona la estrategia de autenticación local
const local = require("passport-local");
// Defino la estrategia local de autenticación
const LocalStrategy = local.Strategy;

// Importo el módulo passport-github2, que proporciona la estrategia de autenticación con GitHub
const GitHubStrategy = require("passport-github2");

// Importo el módulo passport-jwt, que proporciona la estrategia de autenticación con JWT
const jwt = require("passport-jwt");
// Defino una estrategia JWT para Passport
const JWTStrategy = jwt.Strategy;
// Defino un módulo para extraer el token JWT de una cookie específica
const ExtractJwt = jwt.ExtractJwt;

// Importo el modelo de Usuario y las funciones para el hash de contraseñas
const UsuarioModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");

// Función para extraer el token JWT de una cookie específica
const cookieExtractor = (req) => {
    // Inicializa el token como null
    let token = null;
    // Verifica que la solicitud y las cookies existan antes de intentar extraer el token
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    // Devuelve el token, o null si no se encontró
    return token;
}

// Creo una función para inicializar Passport y configurar las estrategias de registro, inicio de sesión y GitHub
const initializePassport = () => {
    // Estrategia de inicio de sesión con local (autenticación local)
    passport.use("login", new LocalStrategy({ usernameField: "email" }, // Campo del formulario que contiene el email
        async (email, password, done) => {
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
        })
    );

    // Serialización y deserialización de usuarios
    passport.serializeUser((user, done) => {
        done(null, user._id); // Guarda el ID del usuario en la sesión
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UsuarioModel.findById({ _id: id });
        done(null, user); // Recupera el usuario de la sesión
    });

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
    }));

    // Estrategia de autenticación con JWT
    passport.use("jwt", new JWTStrategy({
        // Extraigo el token JWT de una cookie
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        // Utilizo una clave secreta almacenada en variables de entorno para verificar el token JWT
        secretOrKey: process.env.JWT_SECRET || "defaultSecretKey"
    },
        // Función asíncrona para manejar el procesamiento del payload JWT
        async (jwt_payload, done) => {
            try {
                // Busco el usuario en la base de datos utilizando el ID del payload JWT
                const user = await UsuarioModel.findById(jwt_payload.user._id);
                // Si no se encuentra el usuario, retorna 'false' con un mensaje de error
                if (!user) {
                    return done(null, false, { message: "User not found" });
                }
                // Si se encuentra el usuario, lo devuelve
                return done(null, user);
            } catch (error) {
                // Manejo cualquier error que ocurra durante la búsqueda del usuario
                return done(error, false, { message: "An error occurred while verifying the user" });
            }
        })
    );
}

// Exporta la función para inicializar Passport
module.exports = initializePassport;
