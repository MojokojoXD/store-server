'use strict';
const cors = require('cors');
// const path = require('path');
const express = require('express');
const { completeOrder,calculateOrder,getStock } = require("./controller");
const {emailConfirmation} = require('./email/emailConfig')

const app = express();
const corsOptions = {
  origin: ["https://yourcausestore.vercel.app","http://localhost:8000"],
};

app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT || 3000;
 
 
//Endpoints
app.get("/", ( req, res ) => {
    emailConfirmation();
})
app.post("/complete-order",completeOrder);

app.post("/create-order",calculateOrder);

app.get("/get-stock/:catalogId",getStock);

 
app.listen(PORT, () => console.log(`Server running on ${PORT}`));