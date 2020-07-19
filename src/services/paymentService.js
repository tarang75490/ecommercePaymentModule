// const app = require('express')()
// const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const config = require('../config/index')
// const cors = require('cors')
// const bodyParser = require('body-parser')

// app.use(cors())
// app.use(bodyParser.json())
const razorpay = new Razorpay({
	key_id: config.razorPay.key_id,
	key_secret: config.razorPay.key_secret
})


const initiatePayment = async (fastify,initiatePaymentRequest)=>{
    try{
    const products = await fastify.axios.get('http://localhost:3008/getProductsOfCart?customerd='+initiatePaymentRequest.customerId)
        console.log(products.data.data)
        let reduceInventoryRequest = {
            variantIds:[],
            quantities:[],
        }
        products.data.data.forEach((product)=>{
            reduceInventoryRequest.variantIds.push(product.variantId)
            reduceInventoryRequest.quantities.push(product.quantityToBuy)
        })
        console.log(reduceInventoryRequest)
        const message = await fastify.axios.post('http://localhost:3000/reduceInventory',reduceInventoryRequest)
        return message
    
    }catch(e){
        return{
            error : "Payment Initialization Unsuccessful"
        }
    }
}

const makePayement = async (fastify,makePaymentRequest)=>{


    

    try {
        const products = await fastify.axios.get('http://localhost:3008/getProductsOfCart?customerId='+makePaymentRequest.customerId)
        console.log(products.data.data)
        const payment_capture = 1
        let totalAmount = 0
        products.data.data.forEach((product)=>{
            totalAmount += product.price * product.quantity
        })
	    const currency = 'INR'
        console.log(totalAmount)
	    const options = {
            amount:totalAmount*100,
            currency,
            receipt: shortid.generate(),
            payment_capture
        }   
		const response = await razorpay.orders.create(options)
		// console.log(response)
		return response
	} catch (error) {
		return {
            error:"payment Failed"
        }
	}
}




module.exports = {
    makePayement,
    initiatePayment
}