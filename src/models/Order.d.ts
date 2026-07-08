import { Schema, Document } from 'mongoose';
export interface IOrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: Schema.Types.ObjectId;
}
export interface IOrder extends Document {
    user?: Schema.Types.ObjectId;
    orderItems: IOrderItem[];
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    totalPrice: number;
    status: 'Pendente' | 'Aprovado' | 'Enviado' | 'Entregue' | 'Cancelado';
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    createdAt: Date;
}
export declare const Order: import("mongoose").Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
//# sourceMappingURL=Order.d.ts.map