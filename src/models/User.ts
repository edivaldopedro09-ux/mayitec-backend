import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  address?: string;    // Adicionado para suportar a morada do utilizador
  profilePic?: string; // Adicionado para guardar o caminho da foto de perfil
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'O nome é obrigatório'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'O email é obrigatório'], 
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido']
  },
  password: { 
    type: String, 
    required: [true, 'A palavra-passe é obrigatória'],
    minlength: [6, 'A palavra-passe deve ter pelo menos 6 caracteres']
  },
  isAdmin: { 
    type: Boolean, 
    required: true, 
    default: false // Por padrão, qualquer novo utilizador é um cliente comum
  },
  address: { 
    type: String, 
    default: '' // Inicializa vazio para evitar valores undefined no Front-End
  },
  profilePic: { 
    type: String, 
    default: '' // Inicializa vazio para o Front-End saber quando usar o avatar padrão
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const User = model<IUser>('User', UserSchema);