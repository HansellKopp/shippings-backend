const express = require('express')
const router = express.Router()
const shipmentsController = require('../controllers/shipmentsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(shipmentsController.getAllShipments)
    .post(shipmentsController.createNewShipment)
    .patch(shipmentsController.updateShipment)
    .delete(shipmentsController.deleteShipment)

module.exports = router