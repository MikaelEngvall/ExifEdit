const express = require("express");
const multer = require("multer");
const exif = require("exiftool-vendored").exiftool;
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload image and extract EXIF data
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const exifData = await exif.read(req.file.path);
    res.json({ exifData, filePath: req.file.path });
  } catch (err) {
    res.status(500).json({ error: "Failed to read EXIF data." });
  }
});

// Update EXIF data
app.post("/update-exif", async (req, res) => {
  const { filePath, exifUpdates } = req.body;
  try {
    await exif.write(filePath, exifUpdates);
    res.json({ message: "EXIF data updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update EXIF data." });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
