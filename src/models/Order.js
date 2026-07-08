"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }, // Removido 'required: true'
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Product' }
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
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
//# sourceMappingURL=Order.js.map