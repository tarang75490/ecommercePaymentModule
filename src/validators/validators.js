const HttpError = require('../models/errors/httpError')

exports.validateMakePaymentRequest = function (req, res, done) {
    if (!req.query.customerId) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'CustomerId is missing'))
    }
    else{
        done()
    }
}


exports.validateInitiatePaymentRequest = function (req, res, done) {
    console.log(req.query)
    if (!req.query.customerId) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'CustomerId is missing'))
    }
    else{
        done()
    }
}


exports.validateMakePaymentForSingleProduct = function (req, res, done) {
    if (!req.body.customerId) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'CustomerId is missing'))
    }else if (!req.body.variantId) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'VariantId is missing'))
    }else if (!req.body.productId) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'Product Id is missing'))
    }else if (!req.body.price) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'Price is missing'))
    }else if (!req.body.productName) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'ProductName is missing'))
    }
    else{
        done()
    }
}