const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    varationId: {
        type: Number,
        required: true,
    },
    productId: {
        type: Number,
        required: true,
    },
    sku: {
        type: String,
    },
    price: {
        type: Number,
    },
    manage_stock: {
        type: String,
    },
    stock_status: {
        type: String,
    },
    stock_quantity: {
        type: Number,
    },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;