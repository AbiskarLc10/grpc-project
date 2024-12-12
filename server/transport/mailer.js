const nodemailer = require("nodemailer");
require('dotenv').config()

console.log(process.env.APP_PASS)
const transporter = nodemailer.createTransport({
  host: "gmail",
  host: 'smtp.gmail.com', 
  secure: false, 
  auth: {
    user: "abiskarlamichhane10@gmail.com",
    pass: process.env.APP_PASS,
  },
});

module.exports = transporter