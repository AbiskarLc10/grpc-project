const AddBook = require("./add-book");
const DeleteBook = require("./delete-book");
const GetAllBook = require("./get-all-books");
const GetBookByAuthor = require("./get-book-byauthor");
const GetBookById = require("./get-book-id");
const GetBookByDate = require("./get-books-by-date");
const GetBooksPerPage = require("./get-books-per-page");
const GetStreamData = require("./get-stream-data");
const UpdateBook = require("./update-book");

class BookService {}

BookService.prototype.AddBook = AddBook;
BookService.prototype.GetAllBook = GetAllBook;
BookService.prototype.DeleteBook = DeleteBook;
BookService.prototype.GetBookByAuthor = GetBookByAuthor;
BookService.prototype.GetBookById = GetBookById;
BookService.prototype.UpdateBook = UpdateBook;
BookService.prototype.GetBookByDate = GetBookByDate;
BookService.prototype.GetBooksPerPage = GetBooksPerPage;
BookService.prototype.GetStreamData = GetStreamData;
module.exports = BookService;
