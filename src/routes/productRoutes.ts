import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware'; // Importa o multer

const router = Router();

// --- ROTAS PÚBLICAS ---
router.get('/', getProducts);
router.get('/:id', getProductById);

// --- ROTAS DE ADMINISTRADOR ---
// Adicionamos upload.single('image') aqui!
router.post('/', protect, admin, upload.single('image'), createProduct); 

router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;