// Genero una clase UserDTO
class UserDTO {
    // Constructor de la clase
    constructor(firstName, lastName, role) {
        this.nombre = firstName;
        this.apellido = lastName;
        this.role = role;
    }
}
// Exporto la clase
module.exports = UserDTO;