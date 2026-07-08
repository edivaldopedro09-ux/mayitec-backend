"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
// 2. Definimos o Schema do Mongoose (as regras para a base de dados)
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
// 3. Exportamos o Modelo
exports.Product = (0, mongoose_1.model)('Product', ProductSchema);
//# sourceMappingURL=Product.js.map