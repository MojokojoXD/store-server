require("dotenv").config();
const { Client, Environment, ApiError } = require("square");

const client = new Client({
  accessToken: process.env.PRODUCTION_AT,
  environment: Environment.Production,
});
    

module.exports = {
    client,
    getLocation: process.env.PRODUCTION_LOCATION,
}

    