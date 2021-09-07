require('dotenv').config();

const PickenService = require("./api/service/PickenService");

const commands = process.argv;

const main = async (command) => {
    try {
        const database = require('./config/mongodb');
        const service = new PickenService();
        await database();
        switch (command) {
            case 'product:update':
                /**
                 * 
                 */
                await service.updateProducts();
                break;
            case 'product:export':
                /**
                 * 
                 */
                await service.exportProducts();
                break;
            case 'product:import':
                /**
                 * 
                 */
                await service.importProducts();
                break;
            case 'order:update':
                /**
                 * 
                 */
                await service.updateOrders();
                break;
            case 'order:export':
                /**
                 * 
                 */
                await service.exportOrders();
                break;
            default:
                break;
        }
        // service = new WooComerceService();
        // await service.orders();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main(commands[2]);