const express = require('express')
const router = express.Router()
const servicesController = require('../controllers/servicesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(servicesController.getAllServices)
    .post(servicesController.createNewService)
    .put(servicesController.updateService)
    .delete(servicesController.deleteService)

router.route('/:id')
    .get(servicesController.getOneService)
    
module.exports = router
