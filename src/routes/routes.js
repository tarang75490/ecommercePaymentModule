const controllers = require('../controllers/controller')
const validators = require('../validators/validators')

// Import Swagger documentation
const documentation = require('./documentation/documentServicesApis')

const routes = [
    {
        method: "POST",
        url: "/makePayment",
        handler: controllers.makePayment,
        schema: documentation.makePayment,
        preValidation: validators.validateMakePaymentRequest
    },
    {
        method: "POST",
        url: "/initialPayment",
        handler: controllers.initiatePayment,
        schema: documentation.initiatePayment,
        preValidation: validators.validateInitiatePaymentRequest
    }

]



module.exports = routes