
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const moment = require('moment');

class WooCommerceService {

    /**
     * 
     */
    constructor() {
        this.api = new WooCommerceRestApi({
            url: process.env.URL_WOO,
            consumerKey: process.env.KEY_WOO,
            consumerSecret: process.env.SEC_WOO,
            version: "wc/v3"
        });
    }

    /**
     * 
     * @returns 
     */
    async products() {
        let totalPages = 1, products = [];
        for (let page = 1; page <= totalPages; page++) {
            const response = await this.api.get("products", {
                per_page: 100,
                page
            });
            totalPages = response.headers['x-wp-totalpages']
            products = products.concat(response.data);
        }
        products = products.slice(0, 4);
        const pageSize = 50;
        const maxPage = Math.ceil(products.length / pageSize);
        for (let page = 0; page < maxPage; page++) {
            const promiseArr = [];
            for (let i = 0; i < pageSize; i++) {
                if (page * pageSize + i >= products.length) {
                    break;
                }
                promiseArr.push(this.productVarations(products[page * pageSize + i].id));
            }
            const proms = await Promise.all(promiseArr);
            for (let i = 0; i < pageSize; i++) {
                if (page * pageSize + i >= products.length) {
                    break;
                }
                products[page * pageSize + i].varations = proms[i];
            }
        }
        return products;
    }

    /**
     * 
     * @param {*} productId 
     */
    async productVarations(productId) {
        console.log('BEGIN PRODUCT VARATIONS ' + "products/" + productId + "/variations");
        const response = await this.api.get("products/" + productId + "/variations", {
            per_page: 100,
        });
        console.log('END PRODUCT VARATIONS ' + "products/" + productId + "/variations");
        return response.data;
    }

    /**
     * 
     */
    async orders(from, status = ['completed']) {
        let totalPages = 1, orders = [];
        if (typeof status === 'string') {
            status = [status];
        }
        for (let page = 1; page <= totalPages; page++) {
            const response = await this.api.get("orders", {
                per_page: 100,
                page
            });
            totalPages = response.headers['x-wp-totalpages'];
            for (let index = 0; index < response.data.length; index++) {
                const order = response.data[index], dateCreated = moment(order.date_created);

                /**
                 * 
                 */
                if (status.indexOf(order.status) == -1) {
                    continue;
                }

                /**
                 * 
                 */
                if (dateCreated.isAfter(from)) {
                    orders.push(order);
                } else {
                    return orders;
                }
            }
        }
        return orders;
    }

    /**
     * 
     */
    async updateProducts(products) {
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            await this.api.put('/products/' + product.productId + '/variations/' + product.varationId, {
                stock_quantity: product.stock_quantity,
                price: product.price
            });
            console.log('PRODUCT UPDATED ' + '/products/' + product.productId + '/variations/' + product.varationId);
        }
    }
}

module.exports = WooCommerceService;
