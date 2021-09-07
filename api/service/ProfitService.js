const fs = require('fs');
const parser = require('xml2json');

class ProfitService {

    constructor() {

    }

    /**
     * 
     * @returns GET all prodcuts from file 
     */
    products(file = 'products.xml') {
        return new Promise((resolve, reject) => {
            console.log('LOAD PRODCUTS FROM ' + file)
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) reject(err);
                const products = parser.toJson(data);
                resolve(JSON.parse(products).products);
            });
        });
    }
}

module.exports = ProfitService;
