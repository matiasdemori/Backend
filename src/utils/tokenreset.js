// Función para generar un token aleatorio de 6 cifras
function generateResetToken() {
    // Genero un número aleatorio entre 100000 y 999999 (ambos incluidos)
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    // Converto el número en una cadena de texto
    return token.toString();
}

// Exporto la función
module.exports = { generateResetToken };