//Creamos una instancia de socket.io del lado del cliente ahora: 
const socket = io(); 

//Creamos una variable para guardar el usuario: 
let user; 
const chatBox = document.getElementById("chatBox");

// Creo una alerta personalizada:
Swal.fire({
    title: "Identificate", 
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat",
    //inputValidator: nos permite validar el input. 
    inputValidator: (value) => {
        // !value nos permite validar que el input no este vacío.
        return !value && "Necesitas escribir un nombre para continuar"
    }, 
    //allowOutsideClick: nos permite que el usuario pueda cerrar la alerta.
    allowOutsideClick: false,

    //then nos permite ejecutar una función cuando se cierra la alerta.
}).then( result => {
    //result.value nos permite obtener el valor que escribimos en el input.
    user = result.value;
})

//Listener de Input:
chatBox.addEventListener("keyup", (event) => {
    //event.key nos permite obtener el valor que escribimos en el input.
    if(event.key === "Enter") {

        if(chatBox.value.trim().length > 0) {
            //Trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

//Listener de Mensajes:
socket.on("message", data => {
    // Guardamos el elemento HTML con el ID "messagesLogs" en una variable.
    let log = document.getElementById("messagesLogs");
    // Inicializamos la variable messages con un string vacío.
    let messages = "";

    // Iteramos sobre el array de mensajes.
    data.forEach( message => {
        // Agregamos el mensaje a la variable messages.
        messages = messages + `${message.user} dice: ${message.message} <br>`
    })

    // Actualizamos el contenido del elemento HTML con el ID "messagesLogs" con la variable messages.
    log.innerHTML = messages;
})