require("dotenv").config();
const { Client, Environment, ApiError } = require("square");

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});
    

module.exports = {
    client,
    getLocation: process.env.LOCATION_ID,
}

    