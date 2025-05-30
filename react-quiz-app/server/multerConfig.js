import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const tempUpload = 'temp_uploads';

async function ensureTempFolder() {
  try {
    await fs.mkdir(tempUpload, { recursive: true });
  } catch (err) {
    console.error('Failed to create temp_upload folder:', err);
  }
}
ensureTempFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUpload);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
