"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Configuração segura do __dirname para ES Modules / TypeScript
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas da API
app.use('/api/products', productRoutes_1.default);
app.use('/api/users', userRoutes_1.default); // -> Direciona para o arquivo userRoutes
app.use('/api/orders', orderRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Conexão ao MongoDB Atlas
const mongoUri = process.env.MONGO_URI || '';
if (!mongoUri) {
    console.error('❌ Erro: A variável MONGO_URI não está definida no arquivo .env');
}
mongoose_1.default.connect(mongoUri)
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
//# sourceMappingURL=server.js.map