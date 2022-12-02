const Client = require('../models/Client')
const Shipment = require('../models/Shipment')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all clients
// @route GET /clients
// @access Private
const getAllClients = asyncHandler(async (req, res) => {
    // Get all clients from MongoDB
    const clients = await Client.find().lean()

    // If no clients 
    if (!clients?.length) {
        return res.status(400).json({ message: 'No clients found' })
    }

    res.json(clients)
})

// @desc Create new client
// @route POST /clients
// @access Private
const createNewClient = asyncHandler(async (req, res) => {
    const { name, email } = req.body

    // Confirm data
    if (!name || !email ) {
        return res.status(400).json({ message: 'Name and email are required' })
    }

    // Check for duplicate name
    const duplicate = await Client.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' })
    }

    // Create and store new client 
    const client = await Client.create(req.body)

    if (client) { //created 
        res.status(201).json({ message: `New client ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid client data received' })
    }
})

// @desc Update a client
// @route PATCH /clients
// @access Private
const updateClient = asyncHandler(async (req, res) => {
    const { _id, name, email, active } = req.body

    // Confirm data 
    if (!_id || !name || !email || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'fields name and email are required' })
    }

    // Does the client exist to update?
    const client = await Client.findById(_id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    // Check for duplicate 
    const duplicate = await Client.findOne({ $or: [ { name: name }, { email: email } ] }).lean().exec()

    // Allow updates to the original client 
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate client name or email' })
    }

    const updatedClient = await Client.findByIdAndUpdate(_id, {...req.body},{new: true})

    res.json({ message: `${updatedClient.name} updated` })
})

// @desc Delete a client
// @route DELETE /clients
// @access Private
const deleteClient = asyncHandler(async (req, res) => {
    const { _id } = req.body

    // Confirm data
    if (!_id) {
        return res.status(400).json({ message: 'Client ID Required' })
    }

    // Does the client still have assigned notes?
    const shipping = await Shipment.findOne({ client: _id }).lean().exec()
    if (shipping) {
        return res.status(400).json({ message: 'Client has assigned shippings' })
    }

    // Does the client exist to delete?
    const client = await Client.findById(_id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    const result = await client.deleteOne()

    const reply = `Client ${result.name} with ID ${result._id} deleted`

    res.json(reply)
})

// @desc get a client
// @route get /clients
// @access Private
const getOneClient = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'field id ist required' })
    }

    const client = await Client.findById(id).exec()

    if (!client) {
        return res.status(400).json({ message: 'Client not found' })
    }

    res.json(client)
})

module.exports = {
    getAllClients,
    createNewClient,
    updateClient,
    deleteClient,
    getOneClient
}