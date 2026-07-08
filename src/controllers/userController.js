"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const express_1 = require("express");
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'chave_secreta_padrao_super_segura';
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: '30d' });
};
// @desc    Registar um novo utilizador
// @route   POST /api/users
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'Este email já está registado' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.User.create({
            name,
            email,
            password: hashedPassword
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address,
                profilePic: user.profilePic,
                token: generateToken(user._id.toString())
            });
        }
        else {
            res.status(400).json({ message: 'Dados de utilizador inválidos' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};
exports.registerUser = registerUser;
// @desc    Autenticar utilizador e obter token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (user && (await bcryptjs_1.default.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address,
                profilePic: user.profilePic,
                token: generateToken(user._id.toString())
            });
        }
        else {
            res.status(401).json({ message: 'Email ou palavra-passe incorretos' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao fazer login', error: error.message });
    }
};
exports.loginUser = loginUser;
// @desc    Obter perfil do utilizador
// @route   GET /api/users/profile
// @access  Privado
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                address: user.address,
                profilePic: user.profilePic,
                orders: user.orders || []
            });
        }
        else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
    }
};
exports.getUserProfile = getUserProfile;
// @desc    Atualizar perfil do utilizador (Nome, Morada, Senha e Foto)
// @route   PUT /api/users/profile
// @access  Privado
const updateUserProfile = async (req, res) => {
    try {
        // LOGS DE DIAGNÓSTICO: Verifica o que está a chegar do Front-End no teu terminal do VS Code
        console.log('--- DIAGNÓSTICO DE UPDATE ---');
        console.log('Dados de Texto (req.body):', req.body);
        console.log('Ficheiro de Imagem (req.file):', req.file);
        const user = await User_1.User.findById(req.user._id);
        if (user) {
            // Modificado para evitar falhas caso passem strings vazias ou nulas
            if (req.body.name !== undefined)
                user.name = req.body.name;
            if (req.body.address !== undefined)
                user.address = req.body.address;
            // Se o utilizador enviou uma nova senha, faz o hash antes de guardar
            if (req.body.password && req.body.password.trim() !== '') {
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(req.body.password, salt);
            }
            // Se o multer processou um ficheiro, atualiza o caminho da imagem de perfil
            if (req.file) {
                user.profilePic = `/uploads/${req.file.filename}`;
            }
            const updatedUser = await user.save();
            console.log('Utilizador salvo com sucesso no Banco:', updatedUser);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                address: updatedUser.address,
                profilePic: updatedUser.profilePic,
                orders: updatedUser.orders || [], // Mantém os pedidos na resposta para o React
                token: generateToken(updatedUser._id.toString())
            });
        }
        else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    }
    catch (error) {
        console.error('Erro detalhado no servidor:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao atualizar perfil', error: error.message });
    }
};
exports.updateUserProfile = updateUserProfile;
// Adiciona esta função no final do teu userController.ts e certifica-te de que está a ser exportada:
const getUsers = async (req, res) => {
    try {
        // Procura todos os utilizadores na base de dados, mas exclui o campo da password por segurança (.select('-password'))
        // Certifica-te de que o teu modelo de utilizador se chama 'User' neste ficheiro
        const users = await User_1.User.find({}).select('-password');
        res.json(users);
    }
    catch (error) {
        console.error("Erro ao listar utilizadores:", error);
        res.status(500).json({ message: 'Erro interno ao procurar a lista de clientes.' });
    }
};
exports.getUsers = getUsers;
//# sourceMappingURL=userController.js.map