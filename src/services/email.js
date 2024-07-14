// Importo nodemailer
const nodemailer = require('nodemailer');

// Clase EmailManager para enviar correos a los usuarios 
class EmailManager {
    // Constructor de la clase
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "matiasdemori@gmail.com",
                pass: "uaco mxne pcob kkvg"
            }
        });
    }

    // Función para enviar correos
    async enviarCorreoCompra(email, first_name, ticket) {
        try {
            // Definimos los datos del correo que queremos enviar
            const mailOptions = {
                from: "Testing <matiasdemori@gmail.com>",
                to: email,
                subject: 'Buy confirmation',
                html: `
                    <h1>Buy confirmation</h1>
                    <p>Thank for your purchase, ${first_name}!</p>
                    <p>The order number is: ${ticket}</p>
                `
            };
            // Enviamos el correo
            await this.transporter.sendMail(mailOptions);

            // Manejo de errores    
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Funcion para enviar mail de restablecimiento
    async enviarCorreoRestablecimiento(email, first_name, token) {
        try {
            // Definimos los datos del correo que queremos enviar
            const mailOptions = {
                from: 'matiasdemori@gmail.com',
                to: email,
                subject: 'Password reset',
                html: `
                    <h1></h1>
                    <p>Hola ${first_name},</p>
                    <p> You have requested to reset your password. Use the following code to change your password:</p>
                    <p><strong>${token}</strong></p>
                    <p>This code will expire in 1 hour.</p>
                    <a href="http://localhost:8080/password">Restore password</a>
                    <p>If you did not request this reset, please ignore this email.</p>
                `
            };

            // Enviamos el correo
            await this.transporter.sendMail(mailOptions);

            // Manejo de errores
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Error sending email: " + error);
        }
    }
}

module.exports = EmailManager;