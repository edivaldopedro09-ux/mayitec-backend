import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mayitec_uploads', // Nome da pasta no teu Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any, // 'as any' ajuda a evitar pequenos conflitos de tipos do TypeScript
});

export const upload = multer({ storage });