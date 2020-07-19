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
    if (!req.query.customerId) {
        res.code(400)
        done(new HttpError('faliure', 20001, 'CustomerId is missing'))
    }
    else{
        done()
    }
}