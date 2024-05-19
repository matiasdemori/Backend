// Importo el módulo bcrypt para el hashing de contraseñas
const bcrypt = require("bcrypt");

// Con esta funcion genero un hash a partir de una contraseña
const createHash = password => {
    // Genero una sal con un nivel de fortaleza de 10
    const salt = bcrypt.genSaltSync(10);
    // Genero el hash sincrónicamente y devuelve el resultado
    return bcrypt.hashSync(password, salt);
};

// Función para verificar si una contraseña es válida
const isValidPassword = (password, hashedPassword) => {
    // Comparo la contraseña proporcionada con el hash almacenado
    return bcrypt.compareSync(password, hashedPassword);
};

// Exporto las funciones para que puedan ser utilizadas en otros módulos
module.exports = {
    createHash,
    isValidPassword
};