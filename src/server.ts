import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

// 1. Definição obrigatória para ES Modules
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middlewares
app.use(cors()); // Se necessário, podemos restringir isto depois, mas para já funciona
app.use(express.json());

// 3. Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Servir ficheiros estáticos (agora que o __dirname existe, isto vai funcionar)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 4. Conexão ao MongoDB
const mongoUri = process.env.MONGO_URI || '';
if (!mongoUri) {
  console.error('❌ Erro: A variável MONGO_URI não está definida no arquivo .env');
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado com sucesso ao MongoDB Atlas!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

app.get('/', (req, res) => {
  res.send('API da Loja Online a funcionar!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});