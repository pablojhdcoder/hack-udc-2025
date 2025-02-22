const mongoose = require('mongoose');
const { Usuario } = require('./models'); // Asegúrate de que la ruta sea correcta

// Conectar a MongoDB
mongoose.connect('mongodb+srv://manuelvalino:riquiri@hackaton2025.7lfy5.mongodb.net/?retryWrites=true&w=majority&appName=hackaton2025')
  .then(async () => {
    console.log('MongoDB conectado');

    // Script para actualizar todos los usuarios
    await Usuario.updateMany({}, { $set: { email: null } }); // Establece 'telefono' a null para todos los usuarios
    console.log('Usuarios actualizados');

    // Cerrar la conexión
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
