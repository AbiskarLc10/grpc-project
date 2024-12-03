const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
const bookClient = require("./grpc-client/booksclient");

app.use(express.json());

app.get("/get-all-books", async (req, res) => {
  try {
    const response = await new Promise((resolve, reject) => {
      bookClient.GetAllBook({}, (err, response) => {
        if (err) {
          console.error("Error calling GetAllBook:", err);
          reject(new Error(err.details || "An unknown error occurred"));
        } else {
          resolve(response);
        }
      });
    });

    return res.status(201).json({
      message: "Books fetched successfully",
      books: response.books,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

app.get("/getbooks/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const response = await new Promise((resolve, reject) => {
      bookClient.GetBookByAuthor({ author }, (error, response) => {
        if (error) {
          console.log(error);
          reject(new Error(error.details || "An unknown error occurred"));
        } else {
          resolve(response);
        }
      });
    });

    return res
      .status(201)
      .json({
        message: "Successfully fetched author books",
        books: response.books,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});