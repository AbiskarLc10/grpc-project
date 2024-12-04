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

    return res.status(201).json({
      message: "Successfully fetched author books",
      books: response.books,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
});
app.post("/books/add", async (req, res) => {
  try {
    const { id, bookName, genre, author } = req.body;

    if (!bookName || !genre || !author) {
      return res.status(400).json({
        message: "Please provide book name, genre and author",
        success: false,
      });
    }

    const response = await new Promise((resolve, reject) => {
      bookClient.AddBook(
        { book: { id, bookName, genre, author } },
        (error, response) => {
          if (error) {
            console.log(error);
            reject(new Error(error.details || "An unknown error occurred"));
          }

          resolve(response);
        }
      );
    });

    return res.status(200).json({ message: response.message, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

app.delete("/book/delete/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const response = await new Promise((resolve, reject) => {
      bookClient.DeleteBook({ bookId }, (error, response) => {
        if (error) {
          console.log(error);
          reject(new Error(error.details || " An unknown error occurred"));
        }
        resolve(response)
      });
    });

    return res.status(200).json({message:"Book deleted Successfully", success: response.success})
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});
app.get("/getbooks-id/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const response = await new Promise((resolve, reject) => {
      bookClient.GetBookById({ bookId }, (error, response) => {
        if (error) {
          console.log(error);
          reject(new Error(error.details || "An unknown error occurred"));
        }

        resolve(response);
      });
    });

    return res.status(201).json({
      message: "Results fetched by book Id",
      book: response.book,
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
