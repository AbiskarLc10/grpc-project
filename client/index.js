const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
const bookroute = require("./route/book-route");
const authorroute = require("./route/author-route");
const errorMiddleWare = require("./middleware/error-middleware");
app.use(express.json());
app.use("/api/books", bookroute);
app.use("/api/author", authorroute);
app.use(errorMiddleWare)

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
