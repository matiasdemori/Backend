const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        // Cargo los carritos existentes desde el archivo al inicializar la clase
        this.cargarCarritos();
    }

    // Cargo los carritos existentes en el archivo
    async cargarCarritos() {
        try {
            // Leo los datos del archivo
            const data = await fs.readFile(this.path, "utf-8");
            // Parseo los datos JSON para obtener un array de objetos carrito
            this.carts = JSON.parse(data);

            // Verifico si hay al menos un carrito creado
            if (this.carts.length > 0) {
                // Busco el ID máximo entre los carritos existentes
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
                // Creo un nuevo array que contiene solo los IDs de los carritos existentes.
                // Busco el valor máximo dentro del array de IDs. El operador de propagación ... se usa para pasar los elementos del array como argumentos separados a Math.max.
            }
        } catch (error) {
            // Capturo el error si es que hay y lo muestro por consola
            console.error("Error al crear los carritos:", error);
            // Si el archivo no existe o está vacío, se crea uno nuevo llamando al método saveCarts
            await this.cargarCarritos();
        }
    }

    // Guardar los carritos en el archivo
    async guardarCarritos() {
        try {
            // Escribo los carritos en el archivo en formato JSON con formato legible (2 espacios de indentación)
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            console.log("Carts saved successfully.");
        } catch (error) {
            // Capturo e informo el error
            console.error("Error saving carts:", error);
        }
    }

    // Crear un nuevo carrito
    async crearCarrito() {
        try {
            // Creo un objeto para el nuevo carrito con un ID único y un array vacío de productos.
            const newCart = {
                id: ++this.ultId, // Incremento el último ID utilizado.
                products: [] // Inicializo el array de productos del nuevo carrito.
            };

            this.carts.push(newCart); // Agrego el nuevo carrito al array de carritos.

            // Guardo el array actualizado en el archivo
            await this.guardarCarritos();

            console.log("Cart created successfully.");
            return newCart; // Devuelvo el nuevo carrito creado
        } catch (error) {
            console.error("Error creating cart:", error);
            throw error; // Relanzo el error para capturarlo en la llamada a esta función
        }
    }


    // Obtener carrito por ID
    async getCarritoById(cartId) {
        try {
            // Busco el carrito con el ID proporcionado en la lista de carritos
            const cart = this.carts.find(c => c.id === cartId);

            // Verifico si no se encontró ningún carrito con ese ID
            if (!cart) {
                console.log("No cart found with that ID.");
                return; // Sino se encontro arrojo el motivo
            }

            return cart; // Sino devuelvo el carrito encontrado
        } catch (error) {
            console.error("Error getting cart by ID:", error);
            throw error; // Relanzo el error para capturarlo en la llamada a esta función
        }
    }

    // Agregar producto al carrito
    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            // Obtengo el carrito por su ID
            const cart = await this.getCarritoById(cartId);

            // Verifico si el carrito no se encontró
            if (!cart) {
                throw new Error("Cart not found.");
            }

            // Busco si el producto ya existe en el carrito
            const existingProduct = cart.products.find(p => p.product === productId);

            // Si el producto ya existe, incremento la cantidad del producto
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                // Si el producto no existe, agregarlo al carrito
                cart.products.push({ product: productId, quantity });
            }

            // Guardo el carrito actualizado en el archivo
            await this.guardarCarritos();

            console.log("Product added to cart successfully.");
            return cart; // Devolvo el carrito actualizado
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw error; // Relanzo el error para capturarlo en la llamada a esta función
        }
    }
}


module.exports = CartManager;
