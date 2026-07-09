import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// Debug: Vamos ver o que o servidor "vê"
console.log("--- DEBUG CLOUDINARY ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "CARREGADO" : "FALHOU");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "CARREGADO" : "FALHOU");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "CARREGADO" : "FALHOU");

// 1. Configurar credenciais do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configurar o armazenamento do Multer direto para o Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mayitec_produtos', // A pasta que será criada automaticamente na sua conta Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

// 3. Criar e exportar o middleware de upload
export const upload = multer({ storage });

// Mantemos a exportação padrão caso precise usar o cloudinary para apagar imagens no futuro
export default cloudinary;