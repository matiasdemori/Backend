// Importo el módulo passport
const passport = require('passport');

// Middleware para la gestión de autenticación
function authMiddleware(req, res, next) {
    // Autenticar el usuario
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }

        // Agrego la información de autenticación al objeto res.locals
        res.locals.isAuthenticated = !!user;

        // Paso el usuario autenticado al objeto req para que esté disponible en los controladores
        req.user = user || null;
        next();
    })(req, res, next);
}

// Exporto el middleware
module.exports = authMiddleware;