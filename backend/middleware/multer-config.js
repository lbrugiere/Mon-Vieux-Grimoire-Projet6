const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error('Format de fichier non supporté'));
    }
    callback(null, true);
  },
}).single('image');

// Gestion du traitement + Sharp
module.exports = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return next();
    }

    try {
      const imagesDir = path.join(__dirname, '..', 'images');
      const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
      const outputPath = path.join(imagesDir, filename);

      await sharp(req.file.buffer)
        .resize({ width: 206, height: 260 })
        .toFile(outputPath);

      req.file.filename = filename;

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};