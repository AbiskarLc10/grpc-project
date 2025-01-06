const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Book Store",
    version: "1.0.0",
    description: "Book Store is an API based on microservice architecture that allows authors to post their books and customers to review, rate, and purchase the books.",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Book Store",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Access token is missing or invalid",
      },
      ForbiddenError: {
        description: "You dont have permission to access this resource",
      },
      NotFound:{
        description: "Resource not found"
      }
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./route/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
