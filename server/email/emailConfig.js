"use strict";

const nodemailer = require('nodemailer')

//create email transport
const emailConfirmation = async(campaign,orderDetails) => {

    const {receiptNumber,shippingAddress,name,email} = orderDetails;

    let transporter = await nodemailer.createTransport({
        host: "smtp.titan.email",
        port: 465,
        secure: true,
        auth: {
            user: `${process.env.EMAIL_USERNAME}`,
            pass: `${process.env.EMAIL_PASS}`
        },
    });

    let info = await transporter.sendMail({
      from: "Kate Dalley <admin@yourcausecampaigns.com>",
      to: `${email}`,
      subject:
        "Order confirmation-thank you for supporting the Kate Dalley Show",
      html: `<div>
                <div style='width:100%;background-color: black;padding: 1em 1.5em'>
                    <img src='https://www.katedalleyshow.com/wp-content/uploads/2021/04/kds-goldlogo60.png' alt='Kate Dalley logo'/>
                </div>
                <div>
                    <h4 style='text-align:center;color: #333;text-transform:uppercase;margin-bottom:2em;'>Your order <span style='color:#378DD6;text-transform:none'>#${receiptNumber}</span> is being shipped to</h4>
                    <p style='text-align:center;color:#333;'>${name}</p>
                    <p style='text-align:center;color:#333;'>${shippingAddress.addressLine1}</p>
                    ${shippingAddress.addressLine2 ? `<p style='text-align:center;color:#333;'>Apt/Suite: ${shippingAddress.addressLine2}</p>` : ""}
                    <p style='text-align:center;color:#333;'>${shippingAddress.locality}, ${shippingAddress.administrativeDistrictLevel1} ${shippingAddress.postalCode}</p>
                </div>
                <div style='width: 75%;background-color:#F7F5F3;margin:auto;border-radius: .5em;padding:.2em;'>
                    <p style='text-align:center;color:#333;'>If you have any question(s) regarding your order, please contact us at <span style='color:#378DD6;'>admin@yourcausecampaigns.com</span></p>
                </div>
            </div>`,
    });

    console.log("Message sent: %s", info.messageId)
}





module.exports = {
    emailConfirmation
}