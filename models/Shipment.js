const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const shipmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Client'
        },
        number: {
            type: String,
            required: true
        },
        date: {
            type: Date,
        },
        dueDate: {
            type: Date,
        },
        reference: {
            type: String,
        },
        payMethod: {
            type: String,
        },
        orderNro: {
            type: String,
        },
        master: {
            type: String,
        },
        house: {
            type: String,
        },
        arrivingDate: {
            type: Date,
        },
        sender: {
            type: String,
        },
        packages: {
            type: String,
        },
        weight: {
            type: String,
        },
        receiver:{
            type: String,
        },
        volume: {
            type: Number
        },
        shippingDate: {
            type: Date,
        },
        description: {
            String
        },
        customsNumber: {
            String
        },
        details: [{
            serviceId: {
                String
            },
            description: {
                String
            },
            quantity: {
                Number
            },
            comments: {
                String
            },
            total: {
                Number
            },
        }]
    },
    {
        timestamps: true
    }
)

shipmentSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
})

module.exports = mongoose.model('Shipping', shipmentSchema)