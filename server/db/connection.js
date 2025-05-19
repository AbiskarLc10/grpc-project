require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("../config/database.json");
const logger = require("../lib/logger");
const environment = process.env.NODE_ENV || "development";
let environmentConfig = config[environment];


const sequelize = new Sequelize({
  database: environmentConfig.database,
  username: environmentConfig.username,
  password: environmentConfig.password,
  dialect: environmentConfig.dialect,
  logging: (message) => {
    logger.info(message);
  },
});



module.exports = sequelize;
