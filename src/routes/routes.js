const controllers = require('../controllers/controller')
const validators = require('../validators/validators')

// Import Swagger documentation
const documentation = require('./documentation/documentServicesApis')

const routes = [
    {
        method: "GET",
        url: "/makePayment",
        handler: controllers.makePayment,
        schema: documentation.makePayment,
        preValidation: validators.validateMakePaymentRequest
    },
    {
        method: "GET",
        url: "/initialPayment",
        handler: controllers.initiatePayment,
        schema: documentation.initiatePayment,
        preValidation: validators.validateInitiatePaymentRequest
    },
    {
        method: "POST",
        url: "/makePaymentForSingleProduct",
        handler: controllers.makePaymentForSingleProduct,
        schema: documentation.makePaymentForSingleProduct,
        preValidation: validators.validateMakePaymentForSingleProduct
    }

]



module.exports = routes