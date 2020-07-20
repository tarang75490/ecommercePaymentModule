const service = require('../services/paymentService')

const HttpError = require('../models/errors/httpError')


exports.makePayment= async (req, res) => {
    try {
        let response = await service.makePayement(req.fastify, req.query)
        console.log(response)
        if(response.error){
            res.code(400)
                throw new HttpError('faliure', 22005,response.error)
        }
        return res.status(200).send({
            status: 'success',
            data: response,
            message:"Payment Done Successfully"
        })
    } catch (e) {
        res.code(500)
        throw new HttpError('faliure', 2001, "Payment Failed", e.message)
    }
}

exports.makePaymentForSingleProduct= async (req, res) => {
    try {
        let response = await service.makePaymentForSingleProduct(req.fastify, req.body)
        console.log(response)
        if(response.error){
            res.code(400)
                throw new HttpError('faliure', 22005,response.error)
        }
        return res.status(200).send({
            status: 'success',
            data: response,
            message:"Payment Done Successfully"
        })
    } catch (e) {
        res.code(500)
        throw new HttpError('faliure', 2001, "Payment Failed", e.message)
    }
}

exports.initiatePayment= async (req, res) => {
    try {
        let response = await service.initiatePayment(req.fastify, req.query)
        // console.log(response)
        if(response.error){
            res.code(400)
                throw new HttpError('faliure', 22005,response.error)
        }
        return res.status(201).send({
            status: 'success',
            data: response,
            message:"Payment Initiated Successfully"
        })
    } catch (e) {
        res.code(500)
        throw new HttpError('faliure', 2001, "Payment initiation Failed", e.message)
    }
}





