const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { convertFile } = require("./converters");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static files from public/
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// 🔄 Handle file uploads with multer
const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("file"), async (req, res) => {
  const file = req.file;
  const format = req.body.format;

  if (!file) return res.status(400).send("No file uploaded.");

  try {
    const convertedPath = await convertFile(file.path, format);
    res.download(convertedPath, (err) => {
      fs.unlinkSync(file.path);
      fs.unlinkSync(convertedPath);
    });
  } catch (err) {
    res.status(500).send("Conversion failed.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
