// Importo el repositorio de carrito
const CartRepository = require("./cart.repository.js");
// Genero una instancia de cartRepository
const cartRepository = new CartRepository();

// Importo el modelo de usuario desde el archivo "user.model.js"
const UserModel = require("../models/user.model.js");
// Importo la función createHash y isValidPassword
const { createHash } = require("../utils/hashbcryp.js");

// Clase UserRepository, encapsulo los métodos para interactuar con la base de datos de usuarios.
class UserRepository {
    // Crear un nuevo usuario
    async create({ first_name, last_name, email, password, age }) {
        try {
            // Creo un nuevo carrito:
            const nuevoCarrito = await cartRepository.crearCarrito();

            // Creo un nuevo usuario:
            const nuevoUsuario = new UserModel({
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id,
                password: createHash(password),
                age
            });

            // Guardo el nuevo usuario en la base de datos
            await nuevoUsuario.save();

            return nuevoUsuario;

        } catch (error) {
            // Manejo cualquier error que pueda ocurrir durante la creación del usuario
            console.error("Error al crear el usuario:", error);
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Buscar un usuario por correo electrónico
    async findByEmail(email) {
        // Valido que el email proporcionado sea un string
        if (typeof email !== 'string') {
            throw new TypeError('The email must be a string');
        }

        try {
            // Uso el método findOne del modelo de usuario para buscar un documento cuyo campo 'email' coincida con el parámetro proporcionado
            return await UserModel.findOne({ email });

        } catch (error) {
            // Manejo cualquier error que ocurra durante la operación de búsqueda
            throw new Error('Search error for user by email: ' + error.message);
        }
    }

    // Buscar un usuario por el carrito asociado
    async findByCart(cartId) {
        try {
            // Uso el método findOne del modelo de usuario para buscar un documento cuyo campo 'cartId' coincida con el parámetro proporcionado
            return await UserModel.findOne({ cartId });

        } catch (error) {
            // Manejo cualquier error que ocurra durante la operación de búsqueda
            throw new Error('Search error for user by cart: ' + error.message);
        }
    }

    // Actualizar el rol de un usuario
    async updateRole(uid, role) {
        try {
            // Uso el método findByIdAndUpdate del modelo de usuario para actualizar el campo 'role' del documento cuyo '_id' coincida con el parámetro proporcionado
            return await UserModel.findByIdAndUpdate(uid, { role }, { new: true });
        } catch (error) {
            // Manejo cualquier error que ocurra durante la operación de actualización
            throw new Error('Update error for user role: ' + error.message);
        }
    }
}

// Exporto la clase UserRepository para que pueda ser utilizada en otros módulos
module.exports = UserRepository;