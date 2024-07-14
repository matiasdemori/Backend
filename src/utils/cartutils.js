// Función para generar un código único para el ticket
const generateUniqueCode = () => {
    // Código aleatorio
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // Longitud del código
    const codeLength = 8;
    // Código generado
    let code = '';

    // Genera un nuevo código aleatorio
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    // Devuelve el código generado
    const timestamp = Date.now().toString(36);
    // Concatena el código con el timestamp
    return code + '-' + timestamp;
}

// Función para calcular el total de la compra
const calcularTotal = (products) => {
    // Inicializo el total en 0
    let total = 0;

    // Calculo el total de los productos
    products.forEach(item => {
        total += item.product.price * item.quantity;
    });

    // Devuelvo el total
    return total;
}

// Exporto las funciones
module.exports = { generateUniqueCode, calcularTotal }