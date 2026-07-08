import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response, NextFunction } from 'express'; // Adicionado Request, Response, NextFunction
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

// Configuração de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS Configuration
const allowedOrigins = ['http://localhost:5173', 'https://mayitec.com', 'https://www.mayitec.com', 'https://mayitec.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middlewares
app.use(express.json());

// 3. Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Servir ficheiros estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rota de teste
app.get('/', (req: Request, res: Response) => {
    res.send('API da Loja Online a funcionar!');
});

// 4. Conexão ao MongoDB
const mongoUri = process.env.MONGO_URI || '';
if (!mongoUri) {
    console.error('❌ Erro: A variável MONGO_URI não está definida no ficheiro .env');
} else {
    mongoose.connect(mongoUri)
        .then(() => console.log('✅ Conectado com sucesso ao MongoDB Atlas!'))
        .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));
}

// 5. GLOBAL ERROR HANDLER COM TIPAGEM TYPESCRIPT (Corrige os erros TS7006)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("❌ ERRO DETETADO NO SERVIDOR:");
    console.error(err.stack); // Isto imprime todo o rasto do erro no log do Render
    
    res.status(500).json({ 
        message: "Erro interno do servidor", 
        error: process.env.NODE_ENV === 'production' ? 'Ocorreu um erro no processamento do ficheiro' : err.message 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor a correr na porta ${PORT}`);
});