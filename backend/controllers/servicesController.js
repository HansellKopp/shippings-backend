const Service = require('../models/Service')
const Shipment = require('../models/Shipment')
const asyncHandler = require('express-async-handler')

// @desc Get all service
// @route GET /service
// @access Private
const getAllServices = asyncHandler(async (req, res) => {

    const services = await Service.find().lean()

    if (!services?.length) {
        return res.status(400).json({ message: 'No services found' })
    }

    res.json(services)
})

// @desc Create new service
// @route POST /service
// @access Private
const createNewService = asyncHandler(async (req, res) => {
    const { code, description, pricePerVolume, price } = req.body

    // Confirm data
    if (!code || !description || typeof pricePerVolume !== 'boolean') {
        return res.status(400).json({ message: 'code, description are required' })
    }

    // Check for duplicate description
    const duplicate = await Service.findOne({ description }).lean().exec()
    

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate description' })
    }

    // Create and store new service 
    const service = await Service.create(req.body)

    if (service) { //created 
        res.status(201).json({ message: `New service ${description} created` })
    } else {
        res.status(400).json({ message: 'Invalid service data received' })
    }
})

// @desc Update a service
// @route PATCH /service
// @access Private
const updateService = asyncHandler(async (req, res) => {
    const { code, description, pricePerVolume, active, _id } = req.body

    // Confirm data
    if (!description || typeof pricePerVolume !== 'boolean' || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'description, active and price per volume are required' })
    }

    // Does the service exist to update?
    const service = await Service.findById(_id).exec()

    if (!service) {
        return res.status(400).json({ message: 'Service not found' })
    }

    // Check for duplicate 
    const duplicate = await Service.findOne({ $or: [ { description }, { code} ] }).lean().exec()

    // Allow updates to the original service 
    if (duplicate && duplicate?._id.toString() !== _id) {
        console.log({service, duplicate, _id})
        return res.status(409).json({ message: 'Duplicate service description' })
    }

    const updatedService = await Service.findByIdAndUpdate(_id, {...req.body},{new: true})

    res.json({ message: `${updatedService.description} updated` })
})

// @desc Delete a service
// @route DELETE /service
// @access Private
const deleteService = asyncHandler(async (req, res) => {
    const { _id } = req.body

    // Confirm data
    if (!_id) {
        return res.status(400).json({ message: 'Service ID Required' })
    }

    // Does the service still have assigned notes?
    const shipping = await Shipment.findOne({ service: _id }).lean().exec()
    if (shipping) {
        return res.status(400).json({ message: 'Service has assigned shippings' })
    }

    // Does the service exist to delete?
    const service = await Service.findById(_id).exec()

    if (!service) {
        return res.status(400).json({ message: 'Service not found' })
    }

    const result = await service.deleteOne()

    console.log({ result })
    const reply = `Servicename ${result.description} with ID ${result._id} deleted`

    res.json(reply)
})

// @desc get a service
// @route get /services
// @access Private
const getOneService = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'field id ist required' })
    }

    const service = await Service.findById(id).exec()

    if (!service) {
        return res.status(400).json({ message: 'Service not found' })
    }

    res.json(service)
})

module.exports = {
    getAllServices,
    createNewService,
    updateService,
    deleteService,
    getOneService
}