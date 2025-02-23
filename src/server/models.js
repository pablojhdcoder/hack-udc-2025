const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Necesario para identificar el contador
  sequenceValue: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const getNextSequenceValue = async (sequenceName) => {
  try {
    const sequenceDocument = await Counter.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true } // Asegura que se crea si no existe
    );

    if (!sequenceDocument) {
      throw new Error('No se pudo obtener el contador');
    }

    return sequenceDocument.sequenceValue;
  } catch (error) {
    console.error('Error al obtener el siguiente valor de secuencia:', error);
    throw error;
  }
};




const initializeCounter = async () => {
  try {
    const existingCounter = await Counter.findById('pedidoId');
    if (!existingCounter) {
      await Counter.create({ _id: 'pedidoId', sequenceValue: 0 });
      console.log('Contador inicializado correctamente.');
    }
  } catch (error) {
    console.error('Error al inicializar el contador:', error);
  }
};


// Esquema para Usuarios
const UsuarioSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  contraseña: { type: String, required: true },
  prefijo: { type: Number, required: true },
  telefono: { type: Number, required: true },
  sexo: { type: String, required: true },
  email: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});

// Esquema para Compras
const CompraSchema = new mongoose.Schema({
  pedidoId: { type: Number, required: true, unique: true }, // Campo único para el ID del pedido
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [{
    producto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    precioTotal: { type: Number, required: true, default: 0 } // Precio total por producto
  }],
  fechaCompra: { type: Date, default: Date.now },
  totalPedido: { type: Number, required: true, default: 0 } // Total del pedido
});

CompraSchema.pre('save', async function (next) {
  console.log('Ejecutando middleware para generar pedidoId...');

  if (!this.pedidoId) {
    try {
      this.pedidoId = await getNextSequenceValue('pedidoId');
      console.log('pedidoId generado:', this.pedidoId);
    } catch (error) {
      console.error('Error al asignar pedidoId:', error);
      return next(error);
    }
  }

  let total = 0;
  this.productos.forEach(producto => {
    producto.precioTotal = producto.cantidad * producto.precioUnitario;
    total += producto.precioTotal;
  });

  this.totalPedido = total;
  next();
});





// Crear modelos
const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Compra = mongoose.model('Compra', CompraSchema);

// Inicializar el contador al iniciar la aplicación
initializeCounter();

// Exportar modelos y la función getNextSequenceValue
module.exports = { Usuario, Compra, getNextSequenceValue, Counter };