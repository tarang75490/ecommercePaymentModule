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
        console.log(initiatePaymentRequest)
        const products = await fastify.axios.get('http://localhost:3001/getProductsOfCart?customerId='+initiatePaymentRequest.customerId)
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
        const message = await fastify.axios.post('http://localhost:3010/reduceInventory',reduceInventoryRequest)
        console.log(message)
        return message
    
    }catch(e){
        // console.log(e)
        return{
            error : "Payment Initialization Unsuccessful"
        }
    }
}
const makePaymentForSingleProduct = async (fastify,makePaymentRequest)=>{
    const payment_capture = 1
    const currency = 'INR'
    let maintainInventoryRequest  =null;
    try {
            maintainInventoryRequest = {
            variantIds:[makePaymentRequest.variantId],
            quantities:[1]
        }
        let productRequest = [{
            variantId:makePaymentRequest.variantId,
            quantity:1,
            productId:makePaymentRequest.productId,
            productName:makePaymentRequest.productName
        }]
        let totalAmount = makePaymentRequest.price
	    const options = {
            amount:totalAmount,
            currency,
            receipt: shortid.generate(),
            payment_capture
        }   
		const response = await razorpay.orders.create(options)
        console.log(maintainInventoryRequest)
        let message;
        let emailRequest = {
            data:productRequest,
            subject:"Thanks For Shopping with Colossal",
            customerId:makePaymentRequest.customerId,
            templateName:"bill",
            totalAmount:totalAmount
        }
        if(response.status === "created"){
            message = await fastify.axios.post('http://localhost:3010/maintainInventory',{...maintainInventoryRequest,message:"success"})
            console.log(message)
            message = await fastify.axios.post('http://localhost:3007/sentMessagebyEmail',emailRequest)

            console.log(message)
        }else{
             message = await fastify.axios.post('http://localhost:3010/maintainInventory',{...maintainInventoryRequest,message:"error"})
        }
        
		return "Payment done"
	} catch (error) {   
        console.log(error)
            const message = await fastify.axios.post('http://localhost:3010/maintainInventory',{...maintainInventoryRequest,message:"error"})
		return {
            error:"payment Failed"+error.response.data.errorCause
        }
	}
}


const makePayement = async (fastify,makePaymentRequest)=>{
    let maintainInventoryRequest = {
        variantIds:[],
        quantities:[],
    }
    let emailRequest = {}
    let productRequest = []

    try {
        const products = await fastify.axios.get('http://localhost:3001/getProductsOfCart?customerId='+makePaymentRequest.customerId)
        console.log(products.data.data)
       
        products.data.data.forEach((product)=>{
            maintainInventoryRequest.variantIds.push(product.variantId)
            maintainInventoryRequest.quantities.push(product.quantityToBuy)
            productRequest.push({
                productId:product.productId,
                productName:product.productName,
                variantId:product.variantId
                ,
                quantity:product.quantityToBuy
            })
        })
        const payment_capture = 1
        let totalAmount = 0
        products.data.data.forEach((product)=>{
            totalAmount += product.price * product.quantityToBuy
        })
	    const currency = 'INR'
        console.log(totalAmount)
	    const options = {
            amount:totalAmount,
            currency,
            receipt: shortid.generate(),
            payment_capture
        }   
		const response = await razorpay.orders.create(options)
        // console.log(maintainInventoryRequest)
        let message;
        let emailRequest = {
            data:productRequest,
            subject:"Thanks For Shopping with Colossal",
            customerId:makePaymentRequest.customerId,
            templateName:"bill",
            totalAmount:totalAmount
        }
        if(response.status === "created"){
            message = await fastify.axios.post('http://localhost:3010/maintainInventory',{...maintainInventoryRequest,message:"success"})
            console.log(message)
            message = await fastify.axios.post('http://localhost:3001/updateCart',{variantIds : maintainInventoryRequest.variantIds})
            console.log(message)
            message = await fastify.axios.post('http://localhost:3007/sentMessagebyEmail',emailRequest)
            await fastify.axios.post('http://localhost:3006/saveCustomerHistory',{
                                                                    customerId : makePaymentRequest.customerId,
                                                                    transactionDetails:products.data.data,
                                                                    totalAmount:totalAmount
                                                                    
                                                                        })

            console.log(message)
        }else{
             message = await fastify.axios.post('http://localhost:3010/maintainInventory',{...maintainInventoryRequest,message:"error"})
        }
        
		return "Payment done"
	} catch (error) {   
        console.log(error)
            const message = await fastify.axios.post('http://localhost:3000/maintainInventory',{...maintainInventoryRequest,message:"error"})
		return {
            error:"payment Failed"+error.response.data.errorCause
        }
	}
}




module.exports = {
    makePayement,
    initiatePayment,
    makePaymentForSingleProduct
}