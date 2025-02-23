// filepath: /home/kai/Documentos/HACKUDC/hack-udc-2025/server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 5000;

app.use(cors());

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
app.post('/upload', upload.single('file'), (req, res) => {
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'File uploaded successfully!', fileUrl });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/scrape-images', async (req, res) => {
  const { url } = req.query;
  if (!url) {
      return res.status(400).send('URL is required');
  }

  try {
      const iOSUserAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36";
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser', // Update this path to the location of your Chromium executable
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins',
          '--disable-site-isolation-trials'
        ]
    });
      const page = await browser.newPage();
      await page.setUserAgent(iOSUserAgent);
      await page.goto(url, { waitUntil: 'networkidle2' });

      const images = await page.evaluate(() => {
          const imgElements = document.querySelectorAll('img');
          const imgUrls = [];
          imgElements.forEach((img) => {
              const src = img.getAttribute('src');
              if (src) {
                  imgUrls.push(src);
              }
          });
          return imgUrls;
      });

      await browser.close();
      res.json(images);
  } catch (error) {
      console.error('Error scraping images:', error);
      res.status(500).send('Failed to scrape images');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

