const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    pricePerVolume: {
        type: Boolean,
        default: true 
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Service', serviceSchema)