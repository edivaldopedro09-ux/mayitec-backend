"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User"); // Ajuste: import { User }
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createAdmin = async () => {
    try {
        // 1. Conectar à base de dados usando a variável de ambiente
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI não encontrada no ficheiro .env");
        }
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Conectado ao MongoDB...');
        // 2. Verificar se já existe um admin
        const adminExists = await User_1.User.findOne({ email: 'admin@mayitec.ao' });
        if (adminExists) {
            console.log('Administrador já existe. Nada a fazer.');
            await mongoose_1.default.disconnect();
            process.exit();
        }
        // 3. Criar o administrador
        const hashedPassword = await bcryptjs_1.default.hash('Admin123@Mayitec', 10);
        await User_1.User.create({
            name: 'Administrador MAYITEC',
            email: 'admin@mayitec.ao',
            password: hashedPassword,
            isAdmin: true,
        });
        console.log('Administrador criado com sucesso!');
        console.log('Email: admin@mayitec.ao');
        console.log('Password: Admin123@Mayitec');
        await mongoose_1.default.disconnect();
        process.exit();
    }
    catch (error) {
        console.error('Erro ao criar admin:', error);
        process.exit(1);
    }
};
createAdmin();
//# sourceMappingURL=seedAdmin.js.map