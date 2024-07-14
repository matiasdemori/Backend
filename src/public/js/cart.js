// Función para agregar un producto al carrito y la exporto
export function eliminarProducto(cartId, productId) {
    // Llamada al servidor para eliminar el producto del carrito
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        // Manejo de la respuesta del servidor
        .then(response => {
            // Verificación de la respuesta del servidor
            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }
            // Actualización de la interfaz de usuario
            location.reload();
        })
        // Manejo de errores
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para vaciar el carrito y la exporto
export function vaciarCarrito(cartId) {
    // Llamada al servidor para vaciar el carrito
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        // Manejo de la respuesta del servidor
        .then(response => {
            // Verificación de la respuesta del servidor
            if (!response.ok) {
                throw new Error('Error al vaciar el carrito');
            }
            // Actualización de la interfaz de usuario
            location.reload();
        })
        // Manejo de errores
        .catch(error => {
            console.error('Error:', error);
        });
}


