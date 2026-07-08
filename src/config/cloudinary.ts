import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Debug: Vamos ver o que o servidor "vê"
console.log("--- DEBUG CLOUDINARY ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "CARREGADO" : "FALHOU");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "CARREGADO" : "FALHOU");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "CARREGADO" : "FALHOU");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;