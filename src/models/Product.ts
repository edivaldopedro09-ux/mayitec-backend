import { Schema, model, Document } from 'mongoose';

// 1. Definimos a Interface (o contrato do TypeScript)
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  createdAt: Date;
}

// 2. Definimos o Schema do Mongoose (as regras para a base de dados)
const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 3. Exportamos o Modelo
export const Product = model<IProduct>('Product', ProductSchema);