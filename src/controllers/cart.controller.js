// Imporo el repositorio de User
const UserRepository = require("../repositories/user.repository.js");
// Genero una instancia de UserRepository
const userRepository = new UserRepository();
// Importo el repositorio de Cart
const CartRepository = require("../repositories/cart.repository.js");
// Genero una instancia de CartRepository
const cartRepository = new CartRepository();
// Importo el repositorio de Product
const ProductRepository = require("../repositories/product.repository.js");
// Genero una instancia de ProductRepository
const productRepository = new ProductRepository();
// Importo el repositorio de Ticket
const TicketRepository = require("../repositories/ticket.repository.js");
// Genero una instancia de TicketRepository
const ticketRepository = new TicketRepository();
// Importo el servicio de Email
const EmailManager = require("../services/email.js");
// Genero una instancia de EmailManager
const emailManager = new EmailManager();

// Clase CartController, encapsulo los métodos para interactuar con la base de datos de carritos.
class CartController {
    // Crear nuevo carrito
    async nuevoCarrito(req, res) {
        try {
            // Llamo al método para crear un nuevo carrito.
            const nuevoCarrito = await cartRepository.crearCarrito();

            // Devuelvo el carrito recién creado en formato JSON.
            res.json(nuevoCarrito);

        } catch (error) {
            // Informo el error generado durante la creación del carrito.
            console.error("Error creating cart", error);
            res.status(500).json({ error: "Internal server error creating the cart" });
        }
    }

    // Obtener carrito por ID
    async getCarritoById(req, res) {
        // Obtengo el ID del carrito desde los parámetros de la solicitud.
        const cartId = req.params.cid;

        try {
            // Llamo al método getCarritoById de CartManager para obtener el carrito por su ID.
            const carrito = await cartRepository.getCarritoById(cartId);

            // Si el carrito no existe, devuelvo un mensaje de error.
            if (!carrito) {
                console.log("There is no such cart with the id");
                return res.status(404).json({ error: "Cart not found" });
            }

            // Devuelvo los productos del carrito como respuesta en formato JSON.
            res.json(carrito.products);

        } catch (error) {
            // Informo el error generado durante la obtención de productos del carrito.
            console.error("Error getting cart products:", error);
            res.status(500).json({ error: "Internal server error while getting cart products" });
        }
    }

    // Agregar producto
    async agregarProductoAlCarrito(req, res) {
        try {
            // Obtengo el ID del carrito y el ID del producto desde los parámetros de la solicitud.
            const cartId = req.params.cid;
            const productId = req.params.pid;

            // Obtención y validación de la cantidad de producto desde el cuerpo de la solicitud
            // Si no tiene la establezco en 1 por defecto.
            const quantity = parseInt(req.body.quantity) || 1;

            // Valido que la cantidad sea un número entero positivo.
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: "The quantity must be a positive integer" });
            }

            // Validación de la existencia del producto
            const producto = await productRepository.getProductById(productId);
            if (!producto) {
                return res.status(404).json({ error: "Product not found" });
            }

            // Validación de la existencia del carrito
            const carrito = await cartRepository.getCarritoById(cartId);
            if (!carrito) {
                return res.status(404).json({ error: "Cart not found" });
            }

            // Verificación de permisos para usuarios premium y propietarios
            if (req.user.role === 'premium' && producto.owner === req.user.email) {
                return res.status(403).json({ error: 'You are not allowed to add products to your own cart' });
            }

            // Agregar producto al carrito
            const updatedCart = await cartRepository.agregarProductoAlCarrito(cartId, productId, quantity);

            // Redirigir al usuario a la vista del carrito actualizado
            res.redirect(`/carts/${cartId}`);

            // Devuelvo los productos actualizados del carrito como respuesta en formato JSON   
            res.json(updatedCart);

        } catch (error) {
            // Manejo de errores internos del servidor
            console.error("Error adding product to cart:", error);
            res.status(500).json({ error: "Internal server error while adding product to cart" });
        }
    }

    // Eliminar producto
    async eliminarProductoDelCarrito(req, res) {
        try {
            // Obtengo el ID del carrito y el ID del producto de los parámetros de la solicitud
            const cartId = req.params.cid;
            const productId = req.params.pid;

            // Llamo al método eliminarProductoDelCarrito del cartManager para eliminar el producto del carrito
            const updatedCart = await cartRepository.eliminarProductoDelCarrito(cartId, productId);

            // Respondo con un mensaje de éxito y el carrito actualizado en formato JSON
            res.json({
                status: 'success',
                message: 'Product removed from cart successfully',
                updatedCart,
            });

        } catch (error) {
            // Manejo cualquier error capturado durante el proceso
            console.error('Error removing product from cart', error);

            // Respondo con un estado HTTP 500 y un mensaje de error en formato JSON
            res.status(500).json({
                status: 'error',
                error: 'Internal Server Error',
            });
        }
    }

    // Actualizar Carrito
    async actualizarCarrito(req, res) {
        const cartId = req.params.cid; // Obtengo el ID del carrito desde los parámetros de la solicitud
        const updatedProducts = req.body; // Obtengo los productos actualizados desde el cuerpo de la solicitud

        try {
            // Llamo a la función actualizarCarrito del gestor de carritos para actualizar el carrito con los nuevos productos
            const updatedCart = await cartRepository.actualizarCarrito(cartId, updatedProducts);

            // Devuelvo el carrito actualizado como respuesta
            res.json(updatedCart);

        } catch (error) {
            // Capturo errores en caso de que ocurra algún problema durante la actualización del carrito
            console.error('Error updating cart', error);
            res.status(500).json({
                status: 'error',
                error: 'Internal Server Error',
            });
        }
    }

    async actualizarCantidadDeProducto(req, res) {
        try {
            // Obtengo el ID del carrito y el ID del producto desde los parámetros de la solicitud
            const cartId = req.params.cid;
            const productId = req.params.pid;

            // Obtengo la nueva cantidad del producto desde el cuerpo de la solicitud
            const newQuantity = req.body.quantity;

            // Llamo a la función actualizarCantidadDeProducto del gestor de carritos para actualizar la cantidad del producto en el carrito
            const updatedCart = await cartRepository.actualizarCantidadDeProducto(cartId, productId, newQuantity);

            // Devvuelvo una respuesta JSON indicando el éxito de la operación y el carrito actualizado
            res.json({
                status: 'success',
                message: 'Product quantity updated correctly',
                updatedCart,
            });

        } catch (error) {
            // Capturo errores en caso de que ocurra algún problema durante la actualización del carrito
            console.error('Error updating the quantity of the product in the cart', error);
            res.status(500).json({
                status: 'error',
                error: 'Internal Server Error',
            });
        }
    }

    async vaciarCarrito(req, res) {
        try {
            // Obtengo el ID del carrito desde los parámetros de la solicitud
            const cartId = req.params.cid;

            // Llamo a la función vaciarCarrito del gestor de carritos para eliminar todos los productos del carrito
            const updatedCart = await cartRepository.vaciarCarrito(cartId);

            // Devuelvo una respuesta JSON indicando el éxito de la operación y el carrito actualizado
            res.json({
                status: 'success',
                message: 'All products in the cart were successfully removed',
                updatedCart,
            });

        } catch (error) {
            // Capturo errores en caso de que ocurra algún problema al vaciar el carrito
            console.error('Error emptying cart', error);
            res.status(500).json({
                status: 'error',
                error: 'Internal Server Error',
            });
        }
    }
    async finalizarCompra(req, res) {
        // Obtengo el ID del carrito desde los parámetros de la solicitud.
        const cartId = req.params.cid;

        try {
            // Obtengo el carrito por su ID.
            const cart = await cartRepository.getCarritoById(cartId);

            // Obtengo los productos del carrito.
            const products = cart.products;

            // Array para almacenar productos no disponibles.
            const productosNoDisponibles = [];

            // Itero sobre los productos del carrito.
            for (const item of products) {

                // Obtengo el ID del producto.
                const productId = item.product;
                // Obtengo el producto por su ID.
                const product = await productRepository.obtenerProductoPorId(productId);

                // Verifico si hay suficiente stock.
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, lo reduzco.
                    product.stock -= item.quantity;
                    await product.save();

                } else {
                    // Si no hay suficiente stock, agrego el ID del producto a la lista de no disponibles.
                    productosNoDisponibles.push(productId);
                    // Muestro un cartel con los productos no disponibles por el momento.
                    console.log(`Product ${productId} is out of stock`);
                }
            }

            // Obtengo el usuario asociado con el carrito.
            const userWithCart = await userRepository.findByCart({ cart: cartId });

            // Creo un nuevo ticket de compra utilizando la función separada.
            const ticket = await ticketRepository.crearTicket(cart, userWithCart);

            // Actualizo el carrito, eliminando los productos no disponibles.
            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));
            await cart.save();  // Guardo los cambios en el carrito.

            // Envío un correo electrónico al usuario confirmando la compra.
            await emailManager.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);

            // Renderizo la vista de checkout con los datos del usuario y del ticket.
            res.render("checkout", {
                cliente: userWithCart.first_name,
                email: userWithCart.email,
                numTicket: ticket._id
            });

        } catch (error) {
            // Capturo y registro cualquier error que ocurra durante el proceso de compra.
            console.error('Error completing purchase', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

// Exporto la clase CartController para que pueda ser utilizada en otros módulos
module.exports = CartController;