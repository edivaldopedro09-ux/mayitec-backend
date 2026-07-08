import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Correção de tipos: garantimos que o segredo existe e contornamos a verificação rígida de payload
      const secret = process.env.JWT_SECRET || 'secret_fallback';
      const decoded = jwt.verify(token, secret) as any;

      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error("Erro na validação do token:", error);
      return res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token encontrado.' });
  }
};