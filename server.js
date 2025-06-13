const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const mime = require('mime-types');
const fs = require('fs');
const { convertFile } = require('./src/converters');

const PORT = process.env.PORT || 3000;  // ✅ Important for Render

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Conversion route
app.post('/convert', upload.single('file'), async (req, res) => {
  const format = req.body.format;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const outputPath = await convertFile(file.path, format);
    return res.download(outputPath);  // <-- This sends the actual file!
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Conversion failed.' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
