//Inicializo una conexión de socket.io entre el cliente y el servidor. 
const socket = io();

//Escucho el evento "productos" del servidor. Cuando se recibe el evento, llamo a la función renderProductos con los datos recibidos del servidor.
socket.on("productos", (data) => {
    renderProductos(data);
})

//Función para renderizar el listado de productos
const renderProductos = (data) => {
    // Verifica si 'data' es un objeto con una propiedad 'docs' que sea un array
    if (data && data.docs && Array.isArray(data.docs)) {
        // Extrae el array de productos de la propiedad 'docs'
        const productos = data.docs;

        // Busco el elemento HTML con el ID "contenedorProductos" y lo guardo en una variable. Este elemento es donde se mostrarán los productos en la interfaz de usuario.
        const contenedorProductos = document.getElementById("contenedorProductos");
        //Vacio el contenido actual del contenedor de productos. Esto se realiza para limpiar el contenedor antes de renderizar los nuevos productos, evitando duplicaciones.
        contenedorProductos.innerHTML = "";

        //Itero sobre cada elemento en el array de productos recibido como parámetro.
        productos.forEach(item => {
            //Creo un nuevo elemento div para cada producto.
            const card = document.createElement("div");
            // Establezco el HTML interno de la tarjeta del producto utilizando una plantilla de cadena de texto.
            card.innerHTML = `
                <p> ID: ${item._id} </p>
                <p> Titulo:  ${item.title} </p>
                <p> Precio: ${item.price} </p>
                <button> Eliminar producto </button>
            `;
            contenedorProductos.appendChild(card);

            //Agregamos el evento al botón de eliminar producto: 
            //Agrego un evento de clic al botón de "Eliminar producto".
            card.querySelector("button").addEventListener("click", () => {
                eliminarProducto(item._id)
            })
        });
    } else {
        console.error("Error: El objeto de productos recibido no tiene la estructura esperada");
    }
}


//Eliminar producto: 
const eliminarProducto = (_id) => {
    socket.emit("eliminarProducto", _id);
}

//Agregar producto: 
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: parseInt(document.getElementById("price").value),
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: parseInt(document.getElementById("stock").value),
        category: document.getElementById("category").value,
        thumbnails: document.getElementById("thumbnails").value,
        status: document.getElementById("status").value === "true"
    };
    socket.emit("agregarProducto", producto);
}
