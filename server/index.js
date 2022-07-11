'use strict';
// const cors = require('cors');
// const path = require('path');
const express = require('express');
const { createCheckout } = require("./controller");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
 
 
//Endpoints
app.get("/", ( req, res ) => {
    res.status(200).send("Yourcausecampaigns");
})
app.post("/create-checkout",createCheckout);
 
app.listen(PORT, () => console.log(`Server running on ${PORT}`));