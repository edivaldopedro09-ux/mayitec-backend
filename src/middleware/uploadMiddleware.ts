import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Definimos uma interface "solta" para garantir que o TS não bloqueie propriedades extras
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mayitec_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as Record<string, any>, // Isto força o TypeScript a aceitar qualquer propriedade aqui
});

export const upload = multer({ 
  storage: storage 
});