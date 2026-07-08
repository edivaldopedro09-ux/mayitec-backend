"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware"); // Importa o multer
const router = (0, express_1.Router)();
// --- ROTAS PÚBLICAS ---
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
// --- ROTAS DE ADMINISTRADOR ---
// Adicionamos upload.single('image') aqui!
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, uploadMiddleware_1.upload.single('image'), productController_1.createProduct);
router.put('/:id', authMiddleware_1.protect, authMiddleware_1.admin, productController_1.updateProduct);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map