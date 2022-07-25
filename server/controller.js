const {client,getLocation} = require('./squareConfig');
const {v4:uuidv4} = require("uuid");
const {shipping:determineShipping,capitalize} = require('./utlis')
const {emailConfirmation} =require("./email/emailConfig")


//create checkout order
const completeOrder = async( req, res ) => {
    const {auth,order,customer} = req.body;
    const idempotencyKey = uuidv4();

    const shipping = {...determineShipping(customer)};
    
    try {
        const response = await client.ordersApi.createOrder({
          order: {
            locationId: getLocation,
            fulfillments: [
              {
                uid: idempotencyKey,
                type: "SHIPMENT",
                state: "PROPOSED",
                shipmentDetails: {
                  recipient: {
                    address: shipping,
                    displayName: `${capitalize(customer.firstName)} ${capitalize(customer.lastName)}`,
                    emailAddress: customer.email,
                    phoneNumber: customer.phone,  
                  },
                  shippingType: "Priority shipping",
                },
              },
            ],
            lineItems: [{
                quantity: order.lineItems[0].quantity,
                catalogObjectId: order.lineItems[0].catalogObjectId,
            }],
             serviceCharges: [
            {
              name: "Shipping and handling",
              amountMoney: {
                amount: 950,
                currency: "USD",
              },
              calculationPhase: "SUBTOTAL_PHASE",
              taxable: false,
            },
          ],
            pricingOptions: {
              autoApplyTaxes: false,
            },
            state: "OPEN"
          },
          idempotencyKey,
        });
        if(response.statusCode === 200){
            try {
              const response2 = await client.paymentsApi.createPayment({
                sourceId: auth.token.token,
                idempotencyKey,
                amountMoney: {
                  amount: parseInt(order.totalMoney.amount),
                  currency: "USD",
                },
                autocomplete: true,
                orderId: response.result.order.id,
                locationId: getLocation,
                billingAddress: {
                  addressLine1: customer.addressLine1,
                  addressLine2: customer.addressLine2
                    ? customer.addressLine2
                    : "",
                  administrativeDistrictLevel1: customer.state,
                  country: "US",
                  locality: customer.city,
                  postalCode: customer.zipcode,
                },
                buyerEmailAddress: customer.email,
                verificationToken: auth.buyer.token,
                shippingAddress: shipping,
              });

              
              
              
              if(response2.statusCode === 200){

                const {buyerEmailAddress,receiptNumber,totalMoney,shippingAddress} = response2.result.payment;
                
                res
                  .status(200)
                  .send(
                    JSON.parse(
                      JSON.stringify({buyerEmailAddress,receiptNumber,totalMoney,shippingAddress}, (key, value) =>
                        typeof value === "bigint" ? value.toString() : value
                      )
                    )
                  );

                emailConfirmation(null,{receiptNumber,shippingAddress,name:`${capitalize(customer.firstName)} ${capitalize(customer.lastName)}`,email:customer.email});
                
              }
          
            } catch (error) {
              console.log(error)
              res.status(400).send(error)
            }
        }

        
    } catch (error) {
       console.log(error)
       res.status(400).send(error)
    }

}


const calculateOrder = async(req,res) => {
   const {quantity,catalogObjectId} = req.body
   try {
      const response = await client.ordersApi.calculateOrder({
        order: {
          locationId: getLocation,
          pricingOptions:{
            autoApplyTaxes: true,
          },
          lineItems: [
            {
              quantity: quantity,
              catalogObjectId: catalogObjectId,
            },
          ],
          serviceCharges: [
            {
              name: "Shipping and handling",
              amountMoney: {
                amount: 0,
                currency: "USD",
              },
              calculationPhase: "SUBTOTAL_PHASE",
              taxable: false,
            },
          ],
        },
      });
      res.status(200).send(JSON.parse(JSON.stringify(response.result.order,(key,value)=> typeof value === "bigint" ? value.toString(): value)));
   } catch (error) {
      console.log(error)
   }
}


const getStock = async(req,res) =>{
  const{catalogId} = req.params;
  try {
  const response = await client.inventoryApi.retrieveInventoryCount(catalogId,getLocation);

  if(response.statusCode === 200){
    res.status(200).send(response.result)
  }else {
    console.log(response.result)
    res.sendStatus(400);
  }
} catch(error) {
  console.log(error);
  res.sendStatus(500);
}
}




module.exports = {
    completeOrder: completeOrder,
    calculateOrder: calculateOrder,
    getStock: getStock,
}