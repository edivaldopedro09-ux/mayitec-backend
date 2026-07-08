import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Verificação de segurança: Se o cloudinary não estiver inicializado, o servidor vai crashar aqui
if (!cloudinary.config().cloud_name) {
  console.error("ERRO CRÍTICO: Cloudinary não está configurado. Verifica as tuas variáveis de ambiente!");
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mayitec_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }] // Otimização: redimensiona antes de guardar
  },
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por ficheiro
});