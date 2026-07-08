"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderToDelivered = exports.updateOrderToPaid = exports.getOrders = exports.getMyOrders = exports.updateOrderStatus = exports.addOrderItems = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
// @desc    Criar uma nova encomenda (Checkout)
// @route   POST /api/orders
// @access  Privado
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;
        if (!orderItems || orderItems.length === 0) {
            res.status(400).json({ message: 'Nenhum item na encomenda' });
            return;
        }
        let calculatedTotalPrice = 0;
        const itemsToSave = [];
        for (const item of orderItems) {
            const dbProduct = await Product_1.Product.findById(item.product);
            if (!dbProduct) {
                res.status(404).json({ message: `Produto com ID ${item.product} não encontrado` });
                return;
            }
            if (dbProduct.stock < item.qty) {
                res.status(400).json({
                    message: `Stock insuficiente para o produto: ${dbProduct.name}. Restam apenas ${dbProduct.stock} unidades.`
                });
                return;
            }
            calculatedTotalPrice += dbProduct.price * item.qty;
            itemsToSave.push({
                product: dbProduct._id,
                name: dbProduct.name,
                image: dbProduct.imageUrl,
                price: dbProduct.price,
                qty: item.qty
            });
        }
        // Criar o registo da encomenda com status inicial 'Pendente'
        const order = new Order_1.Order({
            user: req.user._id,
            orderItems: itemsToSave,
            shippingAddress,
            paymentMethod,
            totalPrice: calculatedTotalPrice,
            status: 'Pendente'
        });
        const createdOrder = await order.save();
        // Reduzir o stock do catálogo após sucesso na criação
        for (const item of itemsToSave) {
            await Product_1.Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.qty }
            });
        }
        res.status(201).json(createdOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao processar a encomenda', error });
    }
};
exports.addOrderItems = addOrderItems;
// @desc    Atualizar status da encomenda (Aprovação/Cancelamento pelo Admin)
// @route   PUT /api/orders/:id/status
// @access  Privado/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Pendente' | 'Aprovado' | 'Enviado' | 'Entregue' | 'Cancelado'
        const order = await Order_1.Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Encomenda não encontrada' });
            return;
        }
        const oldStatus = order.status;
        order.status = status;
        // --- LOGICA DE STOCK INTELIGENTE ---
        // Se o pedido for Cancelado agora, mas antes NÃO estava cancelado -> DEVOLVE STOCK
        if (status === 'Cancelado' && oldStatus !== 'Cancelado') {
            for (const item of order.orderItems) {
                await Product_1.Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.qty }
                });
            }
        }
        // Se o pedido estava Cancelado e o Admin resolver reativar (mudar para Aprovado/Pendente) -> RETIRA STOCK DE NOVO
        if (oldStatus === 'Cancelado' && status !== 'Cancelado') {
            for (const item of order.orderItems) {
                await Product_1.Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.qty }
                });
            }
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status da encomenda', error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
// @desc    Obter as encomendas do utilizador logado
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao obter o histórico de encomendas', error });
    }
};
exports.getMyOrders = getMyOrders;
// @desc    Obter TODAS as encomendas (Painel de Gestão)
const getOrders = async (req, res) => {
    try {
        const orders = await Order_1.Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao obter todas as encomendas', error });
    }
};
exports.getOrders = getOrders;
// @desc    Atualizar encomenda para PAGA
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order_1.Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Encomenda não encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar pagamento', error });
    }
};
exports.updateOrderToPaid = updateOrderToPaid;
// @desc    Atualizar encomenda para ENTREGUE
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order_1.Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = new Date();
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Encomenda não encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar estado de entrega', error });
    }
};
exports.updateOrderToDelivered = updateOrderToDelivered;
//# sourceMappingURL=orderController.js.map