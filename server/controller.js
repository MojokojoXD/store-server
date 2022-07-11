const {client,getLocation} = require('./squareConfig');
const {v4:uuidv4} = require("uuid");

const createCheckout = async( req, res ) => {
    const idempotencyKey = uuidv4();

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
            lineItems: [
              {
                quantity: "1",
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
        res.status(500).send(error); 
    }
}


module.exports = {
    createCheckout: createCheckout,
}