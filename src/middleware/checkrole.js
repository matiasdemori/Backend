// Middleware para comprobar el rol del usuario
const jwt = require('jsonwebtoken');

// Genero una función para comprobar el rol del usuario
const checkUserRole = (allowedRoles) => (req, res, next) => {
    // Obtengo el token de la cookie
    const token = req.cookies.coderCookieToken;

    // Verifico si el token existe
    if (token) {
        jwt.verify(token, 'coderhouse', (err, decoded) => {
            // Si hay un error en la verificación del token, devuelvo un error 403
            if (err) {
                res.status(403).send('Access denied. Invalid Token.');
            } else {
                // Si el token es correcto, verifico el rol del usuario
                const userRole = decoded.user.role;
                // Verifico si el rol del usuario es permitido
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    // Si el rol del usuario no es permitido, devuelvo un error 403
                    res.status(403).send('Access denied. User role is not allowed to access this route.');
                }
            }
        });
        // Si el token no existe, devuelvo un error 403
    } else {
        res.status(403).send('Access denied. Token not provided.');
    }
};

// Exporto la función para comprobar el rol del usuario
module.exports = checkUserRole;