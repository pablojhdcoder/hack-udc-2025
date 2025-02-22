const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Usuario, Compra } = require('./models'); // Importar los modelos

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb+srv://manuelvalino:riquiri@hackaton2025.7lfy5.mongodb.net/?retryWrites=true&w=majority&appName=hackaton2025', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Rutas para manejar usuarios
// Crear un nuevo usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).send(nuevoUsuario);
  } catch (error) {
    res.status(400).send('Error al crear el usuario: ' + error.message);
  }
});

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.send(usuarios);
  } catch (error) {
    res.status(500).send('Error al obtener usuarios: ' + error.message);
  }
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).send('Usuario no encontrado');
    res.send(usuario);
  } catch (error) {
    res.status(500).send('Error al obtener el usuario: ' + error.message);
  }
});

// Actualizar un usuario por ID
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) return res.status(404).send('Usuario no encontrado');
    res.send(usuario);
  } catch (error) {
    res.status(400).send('Error al actualizar el usuario: ' + error.message);
  }
});

// Eliminar un usuario por ID
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).send('Usuario no encontrado');
    res.send('Usuario eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar el usuario: ' + error.message);
  }
});



// Crear una nueva compra
app.post('/api/compras', async (req, res) => {
  try {
    // Validar que el usuario existe
    const usuario = await Usuario.findById(req.body.usuarioId);
    if (!usuario) {
      return res.status(400).send('El usuario no existe.');
    }

    // Validar que los productos sean válidos
    if (!req.body.productos || req.body.productos.length === 0) {
      return res.status(400).send('Se deben proporcionar productos.');
    }

    // Crear la nueva compra
    const nuevaCompra = new Compra(req.body); // Aquí se utilizará el middleware para asignar el pedidoId
    await nuevaCompra.save();
    
    // Enviar la respuesta
    res.status(201).send(nuevaCompra);
  } catch (error) {
    res.status(400).send('Error al crear la compra: ' + error.message);
  }
});

// Obtener todas las compras
app.get('/api/compras', async (req, res) => {
  try {
    const compras = await Compra.find().populate('usuarioId'); // Población para obtener datos del usuario
    res.send(compras);
  } catch (error) {
    res.status(500).send('Error al obtener compras: ' + error.message);
  }
});

// Obtener una compra por ID
app.get('/api/compras/:id', async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate('usuarioId');
    if (!compra) return res.status(404).send('Compra no encontrada');
    res.send(compra);
  } catch (error) {
    res.status(500).send('Error al obtener la compra: ' + error.message);
  }
});

// Actualizar una compra por ID
app.put('/api/compras/:id', async (req, res) => {
  try {
    const compra = await Compra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!compra) return res.status(404).send('Compra no encontrada');
    res.send(compra);
  } catch (error) {
    res.status(400).send('Error al actualizar la compra: ' + error.message);
  }
});

// Eliminar una compra por ID
app.delete('/api/compras/:id', async (req, res) => {
  try {
    const compra = await Compra.findByIdAndDelete(req.params.id);
    if (!compra) return res.status(404).send('Compra no encontrada');
    res.send('Compra eliminada');
  } catch (error) {
    res.status(500).send('Error al eliminar la compra: ' + error.message);
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});