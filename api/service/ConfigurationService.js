const moment = require('moment');
const Configuration = require('./../models/Configuration');

class ConfigurationService {

    keyOrderUpdate = 'KEY_ORDER_UPDATE';

    constructor() {
    }

    async lastOrderUpdate() {
        let conf = await Configuration.findOne({ key: this.keyOrderUpdate }).exec();
        if (!conf) {
            conf = new Configuration({
                key: this.keyOrderUpdate,
                value: { "dt": moment().format('YYYY-MM-DD') }
            })
            await conf.save()
        }
        return conf;
    }

}

module.exports = ConfigurationService;