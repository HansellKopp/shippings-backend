const Shipment = require('../models/Shipment')
const User = require('../models/User')
const Client = require('../models/Client')
const asyncHandler = require('express-async-handler')

// @desc Get all shipments 
// @route GET /shipments
// @access Private
const getAllShipments = asyncHandler(async (req, res) => {
    // Get all shipments from MongoDB
    const shipments = await Shipment.find().lean()

    /* If no shipments
    if (!shipments?.length) {
        return res.status(400).json({ message: 'No shipments found' })
    }
    */

    // Add username to each shipment before sending the response 
    const shipmentsWithUser = await Promise.all(shipments.map(async (shipment) => {
        const client = await Client.findById(shipment.client).lean().exec()
        return { ...shipment, clientName: client.name }
    }))

    res.json(shipmentsWithUser)
})

// @desc Create new shipment
// @route POST /shipments
// @access Private
const createNewShipment = asyncHandler(async (req, res) => {
    const { user_id, client_id, number } = req.body

    // Confirm data
    if (!user_id || !client_id || !number) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate number
    const duplicate = await Shipment.findOne({ number }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate shipment number' })
    }

    // Create and store the new user 
    const shipment = await Shipment.create({ user, client, number })

    if (shipment) { // Created 
        return res.status(201).json({ message: 'New shipment created' })
    } else {
        return res.status(400).json({ message: 'Invalid shipment data received' })
    }

})

// @desc Update a shipment
// @route PATCH /shipments
// @access Private
const updateShipment = asyncHandler(async (req, res) => {
    const body = {...req.body}
    const { _id } = req.body

    // Confirm data
    if (!_id ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm shipment exists to update
    const shipment = await Shipment.findById(_id).exec()

    if (!shipment) {
        return res.status(400).json({ message: 'Shipment not found' })
    }

    // Check for duplicate title
    const duplicate = await Shipment.findOne({ title }).lean().exec()

    // Allow renaming of the original shipment 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate shipment title' })
    }

    // Fill fields
    shipment.user = user
    shipment.client = client
    shipment.dueDate = body.date
    shipment.completed = completed

    const updatedShipment = await shipment.save()

    res.json(`'${updatedShipment.title}' updated`)
})

// @desc Delete a shipment
// @route DELETE /shipments
// @access Private
const deleteShipment = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Shipment ID required' })
    }

    // Confirm shipment exists to delete 
    const shipment = await Shipment.findById(id).exec()

    if (!shipment) {
        return res.status(400).json({ message: 'Shipment not found' })
    }

    const result = await shipment.deleteOne()

    const reply = `Shipment '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllShipments,
    createNewShipment,
    updateShipment,
    deleteShipment
}