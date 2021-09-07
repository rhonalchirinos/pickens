const mongoose = require("mongoose");

module.exports = async () => {
    await mongoose.connect('mongodb://localhost:27017/pickens', { useNewUrlParser: true });

    mongoose.connection.on("error", (error) => {
        console.error(error);
        process.exit(1);
    });

    mongoose.connection.on('connected', function () {
        console.log(' ');
    });

}