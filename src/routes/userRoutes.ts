import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers } from '../controllers/userController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 
import { upload } from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

// Rotas Públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas Privadas (Requerem Token JWT)
router.get('/profile', protect, getUserProfile);

// A rota abaixo é onde ocorre o erro 500 se o middleware ou o controlador falharem
router.put('/profile', protect, upload.single('image'), updateUserProfile); 

// Rota Administrativa
router.get('/', protect, getUsers); 

export default router;