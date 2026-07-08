"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// 1. Importámos a nova função 'getUsers' que vais adicionar ao teu controlador
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = express_1.default.Router();
// Rotas Públicas
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
// Rotas Privadas (Requerem Token JWT)
router.get('/profile', authMiddleware_1.protect, userController_1.getUserProfile);
router.put('/profile', authMiddleware_1.protect, uploadMiddleware_1.upload.single('image'), userController_1.updateUserProfile);
// 2. Rota Administrativa: Responde a GET http://localhost:5000/api/users
// Nota: Se tiveres um middleware de proteção para administradores (ex: admin), coloca-o aqui também!
router.get('/', authMiddleware_1.protect, userController_1.getUsers);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map