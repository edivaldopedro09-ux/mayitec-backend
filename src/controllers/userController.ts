import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interface para estender o Request do Express com os campos 'user' e 'file' (TypeScript First)
interface AuthRequest extends Request {
  user?: any;
  file?: any; // Para o Multer
}

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET || 'chave_secreta_padrao_super_segura';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// @desc    Registar um novo utilizador
// @route   POST /api/users
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Este email já está registado' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
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
    } else {
      res.status(400).json({ message: 'Dados de utilizador inválidos' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// @desc    Autenticar utilizador e obter token
// @route   POST /api/users/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        profilePic: user.profilePic,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Email ou palavra-passe incorretos' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor ao fazer login', error: error.message });
  }
};

// @desc    Obter perfil do utilizador
// @route   GET /api/users/profile
// @access  Privado
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

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
    } else {
      res.status(404).json({ message: 'Utilizador não encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
  }
};

// @desc    Atualizar perfil do utilizador (Nome, Morada, Senha e Foto)
// @route   PUT /api/users/profile
// @access  Privado
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // LOGS DE DIAGNÓSTICO: Verifica o que está a chegar do Front-End no teu terminal do VS Code
    console.log('--- DIAGNÓSTICO DE UPDATE ---');
    console.log('Dados de Texto (req.body):', req.body);
    console.log('Ficheiro de Imagem (req.file):', req.file);

    const user = await User.findById(req.user._id);

    if (user) {
      // Modificado para evitar falhas caso passem strings vazias ou nulas
      if (req.body.name !== undefined) user.name = req.body.name;
      if (req.body.address !== undefined) user.address = req.body.address;

      // Se o utilizador enviou uma nova senha, faz o hash antes de guardar
      if (req.body.password && req.body.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
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
    } else {
      res.status(404).json({ message: 'Utilizador não encontrado' });
    }
  } catch (error: any) {
    console.error('Erro detalhado no servidor:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao atualizar perfil', error: error.message });
  }
};

// Adiciona esta função no final do teu userController.ts e certifica-te de que está a ser exportada:

export const getUsers = async (req: any, res: any) => {
  try {
    // Procura todos os utilizadores na base de dados, mas exclui o campo da password por segurança (.select('-password'))
    // Certifica-te de que o teu modelo de utilizador se chama 'User' neste ficheiro
    const users = await User.find({}).select('-password'); 
    
    res.json(users);
  } catch (error: any) {
    console.error("Erro ao listar utilizadores:", error);
    res.status(500).json({ message: 'Erro interno ao procurar a lista de clientes.' });
  }
};