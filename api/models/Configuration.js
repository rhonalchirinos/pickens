const mongoose = require("mongoose");

const ConfigurationSchema = new mongoose.Schema({
    key: {
        type: String,
    },
    value: {
        type: Object,
    }
});

const Configuration = mongoose.model("Configuration", ConfigurationSchema);

module.exports = Configuration;

