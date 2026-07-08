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

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração segura do __dirname para ES Modules / TypeScript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // -> Direciona para o arquivo userRoutes
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conexão ao MongoDB Atlas
const mongoUri = process.env.MONGO_URI || '';
if (!mongoUri) {
  console.error('❌ Erro: A variável MONGO_URI não está definida no arquivo .env');
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado com sucesso ao MongoDB Atlas!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rota base de teste
app.get('/', (req, res) => {
  res.send('API da Loja Online a funcionar!');
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});