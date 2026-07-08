import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interface para estender o Request do Express
interface AuthRequest extends Request {
  user?: any;
  file?: any;
}

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET || 'chave_secreta_padrao_super_segura';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// @desc    Registar um novo utilizador
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
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // --- LOG DE DIAGNÓSTICO (Olhe o terminal do backend) ---
    console.log('Tentativa de Login:', { email, passwordReceived: !!password });

    const user = await User.findOne({ email });

    if (!user) {
      console.log('LOGIN FALHOU: Utilizador não encontrado');
      res.status(401).json({ message: 'Email ou palavra-passe incorretos' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      console.log('LOGIN SUCESSO: Utilizador autenticado');
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
      console.log('LOGIN FALHOU: Palavra-passe incorreta');
      res.status(401).json({ message: 'Email ou palavra-passe incorretos' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Erro no servidor ao fazer login', error: error.message });
  }
};

// @desc    Obter perfil do utilizador
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

// @desc    Atualizar perfil do utilizador
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.name !== undefined) user.name = req.body.name;
      if (req.body.address !== undefined) user.address = req.body.address;

      if (req.body.password && req.body.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      if (req.file) {
        user.profilePic = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        address: updatedUser.address,
        profilePic: updatedUser.profilePic,
        orders: updatedUser.orders || [],
        token: generateToken(updatedUser._id.toString())
      });
    } else {
      res.status(404).json({ message: 'Utilizador não encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Erro interno ao atualizar perfil', error: error.message });
  }
};

// @desc    Listar todos os utilizadores (Admin)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password'); 
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro interno ao procurar a lista de clientes.' });
  }
};