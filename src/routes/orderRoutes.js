"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// --- ROTAS DE CLIENTE COMUM ---
router.post('/', authMiddleware_1.protect, orderController_1.addOrderItems);
router.get('/myorders', authMiddleware_1.protect, orderController_1.getMyOrders);
// --- ROTAS EXCLUSIVAS DE ADMINISTRADOR ---
router.get('/', authMiddleware_1.protect, authMiddleware_1.admin, orderController_1.getOrders);
router.put('/:id/status', authMiddleware_1.protect, authMiddleware_1.admin, orderController_1.updateOrderStatus); // 2. Cria a rota que o teu Frontend precisa!
router.put('/:id/pay', authMiddleware_1.protect, authMiddleware_1.admin, orderController_1.updateOrderToPaid);
router.put('/:id/deliver', authMiddleware_1.protect, authMiddleware_1.admin, orderController_1.updateOrderToDelivered);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map