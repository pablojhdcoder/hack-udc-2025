const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadDir = 'uploads';

//Configurar CORS para permitir peticiones desde el frontend
app.use(cors());


// Crear la carpeta "uploads" si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Carpeta de destino
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Obtener la extensión
    cb(null, Date.now() + ext);  // Nombre único
  }
});

// Filtrar tipos de archivos permitidos (Opcional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no permitido'), false);
  }
  cb(null, true);
};

// Middleware de subida con filtro
const upload = multer({ storage, fileFilter });

// Ruta para manejar la subida de archivos
app.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No se ha subido un archivo.' });
  }

  res.json({ message: `Archivo subido exitosamente: ${req.file.filename}` });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
