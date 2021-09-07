const Product = require('./../models/Product');

class ProductService {

    constructor() {

    }

    async products() {
        return await Product.find({}).exec();
    }

}

module.exports = ProductService;