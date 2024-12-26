const express = require("express");
require("dotenv").config();
const app = express();
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 8000;
const bookroute = require("./route/book-route");
const authroute = require("./route/auth-route");
const authorroute = require("./route/author-route")
const reviewroute = require("./route/review-route")
const customerroute = require("./route/customer-route")
const paymentroute = require("./route/payment-route")
console.log(process.env.PORT)
const errorMiddleWare = require("./middleware/error-middleware");
app.use(express.json());
app.use(cookieParser())
app.use("/api/books", bookroute);
app.use("/api/author", authorroute);
app.use("/api/review",reviewroute)
app.use("/api/auth",authroute)
app.use("/api/customer",customerroute)
app.use("/api/payment",paymentroute)
app.use(errorMiddleWare)


app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
