require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models/User'); // Ajusta se necessário
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB...');

    const adminExists = await User.findOne({ email: 'admin@mayitec.ao' });
    if (adminExists) {
      console.log('Administrador já existe.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin123@Mayitec', 10);
    await User.create({
      name: 'Administrador MAYITEC',
      email: 'admin@mayitec.ao',
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Admin criado com sucesso!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();