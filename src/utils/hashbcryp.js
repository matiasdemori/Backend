const bcrypt = require("bcrypt");

// Función asíncrona para crear un hash a partir de una contraseña
const createHash = async (password) => {
    // Genera un salt con un factor de costo de 10
    const salt = await bcrypt.genSalt(10);
    // Genera el hash de la contraseña usando el salt generado
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Función asíncrona para verificar si la contraseña proporcionada coincide con el hash almacenado en el usuario
const isValidPassword = async (password, user) => {
    // Compara la contraseña proporcionada con el hash almacenado en el campo 'password' del usuario
    const match = await bcrypt.compare(password, user.password);
    return match;
};

module.exports = { createHash, isValidPassword };