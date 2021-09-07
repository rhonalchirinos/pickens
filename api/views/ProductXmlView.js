const { create } = require('xmlbuilder2');
const fs = require('fs');

class ProductXmlView {

  /** 
   * 
   * 
  */
  data = null;

  /**
   * 
   * @param Product products 
   */
  async process(products) {
    const root = create({ version: '1.0' }).ele('products');
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      const { varationId, productId, sku, price, manageStock: manage_stock, stock_status, stock_quantity } = product;
      root.ele('product', { varationId, productId, sku, price, manageStock: manage_stock, stockStatus: stock_status, stockQuantity: stock_quantity })
    }
    root.up();
    this.data = root.end({ prettyPrint: true });
    return this;
  }

  write(file = 'products.xml') {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, this.data, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }
}

module.exports = ProductXmlView;