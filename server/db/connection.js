require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("../config/database.json");
const environment = process.env.NODE_ENV || "development";
let environmentConfig = config[environment];


const sequelize = new Sequelize({
  database: environmentConfig.database,
  username: environmentConfig.username,
  password: environmentConfig.password,
  dialect: environmentConfig.dialect,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database Successfully");
  })
  .catch((error) => {
    console.log("Failed to connect to database", error);
  });

module.exports = sequelize;
