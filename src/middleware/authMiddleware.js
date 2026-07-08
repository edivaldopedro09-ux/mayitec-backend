"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// 1. Middleware para verificar se o utilizador está autenticado
const protect = async (req, res, next) => {
    let token;
    // Os tokens profissionais são enviados no cabeçalho como: Bearer <TOKEN>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrair o token do cabeçalho
            token = req.headers.authorization.split(' ')[1];
            // Verificar e descodificar o token com a nossa chave secreta do .env
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'chave_secreta_padrao_super_segura');
            // Procurar o utilizador no MongoDB Atlas tirando a senha do retorno por segurança (.select('-password'))
            req.user = await User_1.User.findById(decoded.id).select('-password');
            // Avança para o controlador ou para o próximo middleware
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Não autorizado, token inválido ou expirado' });
            return;
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
        return;
    }
};
exports.protect = protect;
// 2. Middleware para verificar se o utilizador é Administrador
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação' });
    }
};
exports.admin = admin;
//# sourceMappingURL=authMiddleware.js.map