const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Book Store",
    version: "1.0.0",
    description: "My API Description",
  },
  // servers: [
  //   {
  //     url: "https://api.example.com/v1",
  //     description: "Auth server",
  //   },
  // ],
};

const options = {
  swaggerDefinition,
  apis: ["./route/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
