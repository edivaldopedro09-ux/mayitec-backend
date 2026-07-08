import path from 'path';
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

// Middlewares
// Permite acesso de qualquer origem. 
// Em produção, podes restringir para: app.use(cors({ origin: 'https://mayitec.vercel.app' }));
app.use(cors()); 
app.use(express.json());

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Servir ficheiros estáticos (A CORREÇÃO DO ERRO)
// process.cwd() aponta para a raiz do teu projeto, evitando erros de caminho em ESM
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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