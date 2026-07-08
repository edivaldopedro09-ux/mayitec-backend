import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
  file?: any;
}

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET || 'chave_secreta_padrao_super_segura';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: 'Email ou palavra-passe incorretos' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
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

      // CORREÇÃO AQUI: Cloudinary retorna o URL completo em req.file.path
      if (req.file) {
        user.profilePic = req.file.path; 
        console.log("Nova foto de perfil definida:", req.file.path);
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
    console.error("Erro crítico em updateUserProfile:", error);
    res.status(500).json({ message: 'Erro interno ao atualizar perfil', error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password'); 
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro interno ao procurar a lista de clientes.' });
  }
};