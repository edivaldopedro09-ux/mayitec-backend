import { Router } from 'express';
import { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  updateOrderStatus, // 1. Importa a nova função aqui
  updateOrderToPaid, 
  updateOrderToDelivered 
} from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// --- ROTAS DE CLIENTE COMUM ---
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);

// --- ROTAS EXCLUSIVAS DE ADMINISTRADOR ---
router.get('/', protect, admin, getOrders); 
router.put('/:id/status', protect, admin, updateOrderStatus); // 2. Cria a rota que o teu Frontend precisa!
router.put('/:id/pay', protect, admin, updateOrderToPaid); 
router.put('/:id/deliver', protect, admin, updateOrderToDelivered); 

export default router;