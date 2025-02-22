const mongoose = require('mongoose');
const { getNextSequenceValue } = require('./models'); // Asegúrate de que la ruta sea correcta

mongoose.connect('mongodb+srv://manuelvalino:riquiri@hackaton2025.7lfy5.mongodb.net/?retryWrites=true&w=majority&appName=hackaton2025', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB conectado');

    try {
      const nextId = await getNextSequenceValue('pedidoId');
      console.log('El siguiente pedidoId generado es:', nextId);
    } catch (error) {
      console.error('Error al obtener el siguiente pedidoId:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
