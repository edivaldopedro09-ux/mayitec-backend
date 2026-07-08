import { Request, Response } from 'express';
import { Product } from '../models/Product';

// @desc    Obter todos os produtos (Montra)
// @route   GET /api/products
// @access  Público
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao procurar produtos', error });
  }
};

// @desc    Obter um único produto por ID (Página de Detalhes)
// @route   GET /api/products/:id
// @access  Público
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao procurar o produto', error });
  }
};

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Privado/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    // Captura o caminho da imagem se existir, senão usa uma string vazia ou placeholder
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
      name,
      description,
      price,
      imageUrl, // Utiliza o caminho processado pelo multer
      stock,
      category
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar produto', error });
  }
};

// @desc    Atualizar um produto existente
// @route   PUT /api/products/:id
// @access  Privado/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.stock = stock !== undefined ? stock : product.stock;
      product.category = category || product.category;
      
      // Se uma nova imagem for enviada, atualizamos o path
      if (req.file) {
        product.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar produto', error });
  }
};

// @desc    Eliminar um produto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Produto removido com sucesso' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao eliminar produto', error });
  }
};