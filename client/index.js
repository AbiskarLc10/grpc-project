const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
const bookroute = require("./route/book-route");

app.use(express.json());
app.use("/api/books", bookroute);

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
