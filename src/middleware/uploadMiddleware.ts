import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --- Correção para ES Modules (__dirname) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Garante que a pasta existe ao iniciar
// Adicionei { recursive: true } para evitar erros caso a pasta pai não exista
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); 
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({ storage });