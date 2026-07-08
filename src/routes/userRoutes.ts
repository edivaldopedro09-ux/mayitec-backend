import express from 'express';
// 1. Importámos a nova função 'getUsers' que vais adicionar ao teu controlador
import { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers } from '../controllers/userController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 
import { upload } from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

// Rotas Públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas Privadas (Requerem Token JWT)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('image'), updateUserProfile); 

// 2. Rota Administrativa: Responde a GET http://localhost:5000/api/users
// Nota: Se tiveres um middleware de proteção para administradores (ex: admin), coloca-o aqui também!
router.get('/', protect, getUsers); 

export default router;