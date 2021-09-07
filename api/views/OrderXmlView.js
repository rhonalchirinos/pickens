const { create } = require('xmlbuilder2');
const fs = require('fs');

class OrderXmlView {

  /**
   * @param {*} file 
   * @returns 
   */
  async orders(orders) {
    const root = create({ version: '1.0' }).ele('orders');

    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      const { payload } = order;
      const xmlOrder = root.ele('order', {
        id: order.id,
        status: payload.status,
        currency: payload.currency,
        dateCreated: payload.date_created,
        discountTotal: payload.discount_total,
        discountTax: payload.discount_tax,
        shippingTotal: payload.shipping_total,
        shippingTax: payload.shipping_tax,
        cartTax: payload.cart_tax,
        total: payload.total,
        totalTax: payload.total_tax,
        paymentMethodTitle: payload.payment_method_title,
        currencySymbol: payload.currency_symbol,
      })

      xmlOrder.ele('billing', payload.billing);
      const s = xmlOrder.ele('items');
      for (let k = 0; k < payload.line_items.length; k++) {
        const item = payload.line_items[k];
        s.ele('item', {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          subtotal: item.subtotal,
          subtotalTax: item.subtotal_tax,
          total: item.total,
          totalTax: item.total_tax,
          sku: item.sku,
          price: item.price,
        });
      }
    }
    root.up();
    this.data = root.end({ prettyPrint: true });
    return this;
  }

  /**
   * @param {*} file 
   * @returns 
   */
  write(file = 'orders.xml') {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, this.data, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}

module.exports = OrderXmlView;