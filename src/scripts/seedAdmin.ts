import mongoose from 'mongoose';
import { User } from '../models/User.js'; // Ajuste: import { User }
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // 1. Conectar à base de dados usando a variável de ambiente
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não encontrada no ficheiro .env");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB...');

    // 2. Verificar se já existe um admin
    const adminExists = await User.findOne({ email: 'admin@mayitec.ao' });

    if (adminExists) {
      console.log('Administrador já existe. Nada a fazer.');
      await mongoose.disconnect();
      process.exit();
    }

    // 3. Criar o administrador
    const hashedPassword = await bcrypt.hash('Admin123@Mayitec', 10);
    
    await User.create({
      name: 'Administrador MAYITEC',
      email: 'admin@mayitec.ao',
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Administrador criado com sucesso!');
    console.log('Email: admin@mayitec.ao');
    console.log('Password: Admin123@Mayitec');
    
    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    process.exit(1);
  }
};

createAdmin();