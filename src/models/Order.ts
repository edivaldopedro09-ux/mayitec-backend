import { Schema, model, Document } from 'mongoose';

export interface IOrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: Schema.Types.ObjectId;
}

export interface IOrder extends Document {
  user?: Schema.Types.ObjectId; // Opcional para compras rápidas
  orderItems: IOrderItem[];
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  status: 'Pendente' | 'Aprovado' | 'Enviado' | 'Entregue' | 'Cancelado'; // Novo campo de controle
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Removido 'required: true'
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }
    }
  ],
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  paymentMethod: { type: String, required: true, default: 'Transferência' },
  totalPrice: { type: Number, required: true, default: 0.0 },
  
  // Campo crucial para o teu fluxo de aprovação
  status: { 
    type: String, 
    required: true, 
    default: 'Pendente' 
  },
  
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Order = model<IOrder>('Order', OrderSchema);