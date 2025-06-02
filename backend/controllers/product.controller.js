import Product from '../models/product.model.js';
import redisClient from '../client/redisClient.js';

export const createProduct = async (req, res) => {
    const { name, price, image, userId } = req.body;

    if (!name || !price || !image || !userId) {
        return res.status(400).json({ success: false, message: 'Please enter all fields' });
    }

    try {
        const newProduct = new Product({ name, price, image, userId });
        await newProduct.save();
        await invalidateCache(userId);
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in Create Product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getProducts = async (req, res) => {
    const { userId, offset = 0, limit = 9 } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const cacheKey = `products:${userId}:${offset}:${limit}`;

    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ success: true, data: JSON.parse(cached) });
        }

        const products = await Product.find({ userId }).skip(parseInt(offset)).limit(parseInt(limit));

        await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 });

        return res.status(200).json({ success: true, data: products });
    } catch (err) {
        console.error("Error in Get Products:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


export const updateProduct = async (req, res) => {
    const { id } = req.params
    const product = req.body
    const { userId } = req.body;
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: 'Please enter all fields' })
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true })
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        await invalidateCache(userId);
        res.status(200).json({ success: true, data: updatedProduct })
    } catch (err) {
        console.error("Error in Update Product:", err.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    const { userId } = req.body;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await invalidateCache(userId);
        res.status(200).json({ success: true, message: 'Product is deleted' });
    } catch (error) {
        console.error("Error in Delete Product:", error.message)
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

const invalidateCache = async (userId) => {
    try {
        const keys = await redisClient.keys(`products:${userId}:*`);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.log("Error: ", err);
    }
}