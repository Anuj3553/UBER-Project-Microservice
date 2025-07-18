const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('Ride Service connected to MongoDB');
    }).catch((err) => {
        console.error('MongoDB connection error:', err);
    });
}

module.exports = connect;