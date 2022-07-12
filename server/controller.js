const {client,getLocation} = require('./squareConfig');
const {v4:uuidv4} = require("uuid");
const date = require("date-and-time");


//create checkout order
const createCheckout = async( req, res ) => {
    const {quantity} = req.body;
    console.log(quantity);
    const idempotencyKey = uuidv4();

    const time = new Date();

    try {
        const response = await client.checkoutApi.createPaymentLink({
          idempotencyKey,
          checkoutOptions: {
            acceptedPaymentMethods: {
              applePay: true,
              cashAppPay: true,
              googlePay: true,
            },
            askForShippingAddress: true,
          },
          description: "Kate dalley comemorative coin",
          order: {
            locationId: getLocation,
            serviceCharges: [
                {
                    name: "Shipping",
                    amountMoney:{
                        amount: 0,
                        currency: "USD",
                    },
                    calculationPhase: "SUBTOTAL_PHASE"
                }
            ],
            lineItems: [
              {
                quantity: quantity,
                catalogObjectId: "KFOUYHD3IE7VQTARCAPZDPLJ",
              },
            ],
          },
        });

        if(response.statusCode === 200){
            const {paymentLink} = response.result;
            res.status(200).send(paymentLink)
        }else{
            res.status(503).send(response.result);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error); 
    }
}


module.exports = {
    createCheckout: createCheckout,
}