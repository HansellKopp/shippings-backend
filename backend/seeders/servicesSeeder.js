const Service = require('../models/Service')

const services = [
    {
        "code": "01",
        "description": "ORL-MCY @",
        "pricePerVolume": true,
        "price": 17.9
    },
    {
        "code": "02",
        "description": "PACKING OR REPACKING FEE",
        "pricePerVolume": false,
        "price": 5
    },
    {
        "code": "03",
        "description": "SALES OF PRODUCTS",
        "pricePerVolume": false,
        "price": 4
    },
    ]


seedServices = () => {
    services.forEach(async (service)=> {
        const { description } = service

        const duplicate = await Service.findOne({ description }).lean().exec()
    
        if (duplicate) {
            return;
        }

        await Service.create(service)
        
        console.log(`User ${description} created`)
    })
}

module.exports = {
    seedServices
}