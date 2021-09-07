const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
    },
    date_created: {
        type: String,
    },
    total: {
        type: Number,
    },
    billing: {
        type: String,
    },
    payload: {
        type: Object,
    }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;

