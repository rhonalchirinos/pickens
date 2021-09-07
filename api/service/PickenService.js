const Product = require("../models/Product");
const ConfigurationService = require("./ConfigurationService");
const ProductService = require("./ProductService");
const WooCommerceService = require("./WooCommerceService")
const moment = require('moment');
const OrderService = require("./OrderService");
const Order = require("../models/Order");
const ProductXmlView = require("../views/ProductXmlView");
const OrderXmlView = require("../views/OrderXmlView");
const ProfitService = require("./ProfitService");

class PickenService {

    from = 180;

    constructor() {
        this.wooCommerceService = new WooCommerceService();
        this.productService = new ProductService();
        this.ordersService = new OrderService();
        this.configurationService = new ConfigurationService();
        this.profitService = new ProfitService();
    }

    /**
     * 
     */
    async updateProducts() {
        console.log('BEGIN PROCESS UPDATE PRODUCTS');
        const productsPickens = await this.wooCommerceService.products();
        const products = await this.productService.products();
        /**
         * update 
         */
        for (let index = 0; index < productsPickens.length; index++) {
            const productPicken = productsPickens[index];
            const { varations } = productPicken;
            /**
             * Store allvarations
             */
            for (let i = 0; i < varations.length; i++) {
                const varation = varations[i];
                if (varation.sku === "" || !varation.sku) {
                    continue;
                }
                const product = products.find(p => p.sku == varation.sku) ?? new Product();
                const { id, sku, price, manage_stock, stock_status, stock_quantity } = varation;
                Object.assign(product, { productId: productPicken.id, varationId: id, sku, price, manage_stock, stock_status, stock_quantity, varations });
                await product.save();
                console.log('PRODUCTO GUARDADO :' + sku);
            }
        }

        /**
         * Elements for Delete.
         */
        const forDelete = products.filter(d => !productsPickens.find(p => p.id == d.externalId));

        for (let index = 0; index < forDelete.length; index++) {
            await forDelete[index].delete();
        }

        /**
         * Store products list in a file, here i want to write all data.
         */
        console.log('END PROCESS UPDATE PRODUCTS');
    }

    /**
     * 
     */
    async exportProducts(format = 'xml') {
        const products = await this.productService.products();
        switch (format) {
            case 'xml':
                const xmlService = new ProductXmlView();
                await (await xmlService.process(products)).write();
                break;
            default:
                break;
        }
    }

    /**
     * 
     */
    async importProducts() {
        console.log('BEGIN IMPORT PRODUCTS');
        const productsImport = await this.profitService.products();
        for (let index = 0; index < productsImport.length; index++) {
            const product = productsImport[index];
            await Product.updateOne({ sku: product.sku }, product);
        }
        const products = await this.productService.products();
        await this.wooCommerceService.updateProducts(products);
        console.log('END IMPORT PRODUCTS');
    }

    /**
     * 
     */
    async updateOrders() {
        const orders = await this.wooCommerceService.orders(moment().subtract(this.from, 'days'));

        /**
         * 
         */
        for (let index = 0; index < orders.length; index++) {
            const item = orders[index];
            let order = await this.ordersService.find(item.id);
            if (!order) {
                order = new Order({
                    orderId: item.id,
                    status: item.status,
                    date_created: item.date_created,
                    total: item.total,
                    billing: Object.values(item.billing).filter(d => d).join(', '),
                    payload: item,
                });
                await order.save();
            }
        }
        console.log(JSON.stringify(orders.map(d => d.date_created)));
    }

    /**
     * 
     */
    async exportOrders(format = 'xml') {
        const from = moment().subtract(this.from, 'days').format('YYYY-MM-DD');
        const orders = await this.ordersService.orders(from);
        switch (format) {
            case 'xml':
                const xmlService = new OrderXmlView();
                await (await xmlService.orders(orders)).write();
                break;
            default:
                break;
        }
    }

}

module.exports = PickenService;