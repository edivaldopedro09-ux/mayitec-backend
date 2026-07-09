import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; // Middleware do Cloudinary

const router = Router();

// --- ROTAS PÚBLICAS ---
router.get('/', getProducts);
router.get('/:id', getProductById);

// --- ROTAS DE ADMINISTRADOR ---
// Faz o upload da imagem ao criar o produto
router.post('/', protect, admin, upload.single('image'), createProduct); 

// ADICIONADO: upload.single('image') para permitir alterar a foto na atualização do produto
router.put('/:id', protect, admin, upload.single('image'), updateProduct);

router.delete('/:id', protect, admin, deleteProduct);

export default router;