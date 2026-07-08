"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
exports.User = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=User.js.map