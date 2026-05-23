const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folder) => {
  const dest = path.join(__dirname, `../../uploads/${folder}`);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique = `${req.Usuario.id}_${Date.now()}${ext}`;
      cb(null, unique);
    },
  });
};

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

const uploadProfile = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const uploadBanner = multer({
  storage: createStorage('banners'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const uploadPost = multer({
  storage: createStorage('posts'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
});

module.exports = { uploadProfile, uploadBanner, uploadPost };
