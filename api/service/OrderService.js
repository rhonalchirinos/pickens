const Order = require('./../models/Order');

class OrderService {

    constructor() {

    }

    async find(orderId) {
        return await Order.findOne({ orderId }).exec();
    }

    /**
     * 
     * @param String from  // format YYYY-DD-MM
     * @returns 
     */
    async orders(from) {
        return await Order.find({ date_created: { $gt: from } }).exec();
    }
}

module.exports = OrderService;