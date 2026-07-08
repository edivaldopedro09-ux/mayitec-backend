import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Extensão da interface Request do Express para aceitar o objeto user customizado
export interface AuthenticatedRequest extends Request {
  user?: any;
}

interface JwtPayload {
  id: string;
}

// 1. Middleware para verificar se o utilizador está autenticado
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Os tokens profissionais são enviados no cabeçalho como: Bearer <TOKEN>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrair o token do cabeçalho
      token = req.headers.authorization.split(' ')[1];

      // Verificar e descodificar o token com a nossa chave secreta do .env
     const secret = (process.env.JWT_SECRET as string) || 'chave_secreta_padrao_super_segura';
const decoded = jwt.verify(token, secret) as any;

      // Procurar o utilizador no MongoDB Atlas tirando a senha do retorno por segurança (.select('-password'))
      req.user = await User.findById(decoded.id).select('-password');

      // Avança para o controlador ou para o próximo middleware
      next();
    } catch (error) {
      res.status(401).json({ message: 'Não autorizado, token inválido ou expirado' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
    return;
  }
};

// 2. Middleware para verificar se o utilizador é Administrador
export const admin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação' });
  }
};