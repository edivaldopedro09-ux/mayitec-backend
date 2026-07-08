import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    getUsers 
} from '../controllers/userController.js'; 
import { protect } from '../middleware/authMiddleware.js'; 
import { upload } from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

// Rotas Públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas Privadas (Requerem Token JWT)
router.get('/profile', protect, getUserProfile);

/**
 * Rota de Atualização de Perfil
 * protect: Verifica se o utilizador está logado
 * upload.single('image'): Processa o ficheiro enviado com a chave 'image'
 * updateUserProfile: O controlador que guarda a URL no MongoDB
 */
router.put('/profile', protect, upload.single('image'), updateUserProfile); 

// Rota Administrativa
router.get('/', protect, getUsers); 

export default router;