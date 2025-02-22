// filepath: /home/kai/Documentos/HACKUDC/hack-udc-2025/server.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Endpoint to handle file uploads
app.post('/upload', upload.array('files'), (req, res) => {
  const fileUrls = req.files.map(file => `http://localhost:${PORT}/uploads/${file.filename}`);
  res.status(200).json({ message: 'Files uploaded successfully!', fileUrls });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});