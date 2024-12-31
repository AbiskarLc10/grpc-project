# Book Store System - grpc/ Nodejs

Book Store is an API based on microservice architecture that allows authors to post their books and customers to review, rate, and purchase the books.

# Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Server](#server)
    - [Dependencies](#Server-Dependencies)
    - [Starting server](#starting-server)
      - [Prerequisites](#Prerequisites)
  - [Gateway](#gateway)
    - [Dependencies](#gateway-dependencies)
    - [Starting express server](#starting-express-server)
- [API Documentation](#api-documentation)
  - [Base URL](#base-url)
  - [Endpoints](#endpoints)
    - [Author Endpoints](#author-endpoints)
    - [Books Endpoints](#books-endpoints)
    - [Books Review Endpoints](#books-review-endpoints)
    - [Customer Endpoints](#customer-endpoints)

# Features

1. CRUD operations with gRPC and REST API.
2. Token-based authentication system.
3. Database integration with MySQL.
4. Error handling and validation with Zod.

# Installation

Follow these steps to set up the project locally.

## Clone this repository

```sh
git clone https://github.com/AbiskarLc10/grpc-project.git
```

## `Server`

The server consists of following dependencies

### Server Dependencies

- **node-grpc/grpcjs** : grpc based server
- **Mysql**: Database
- **Sequelize**: ORM for database setup
- **bcrypt**: Password hashing
- **jsonwebtoken**: Token based authentication

### Starting server

To start the server, make sure that your system has following things:

#### `Prerequisites`

- [Node.js](https://nodejs.org) (version 16.x or higher)
- [`Mysql server`](https://mysql.com/) (After downloading make sure server is running)

Create a configuration file named .env inside the `Server` folder. Now include the following variables

```
DB_USER = "root"
DB_PASSWORD = "password"
DB_NAME = "test"
DB_HOST = "db"
PRIVATE_KEY = "jwt private key as per your choice"
CUSTOMER_HOST_URL = "localhost:50052"
AUTHOR_HOST_URL = "localhost:50051"

```

To install all dependencies

```sh
cd server && npm install
```

To setup database schema through migration

```sh

npx sequelize-cli db:migrate

```

## `gateway`

The express server consists of following dependencies:

## Dependencies

- **node-grpc/grpc-js**: For grpc client
- **express**: For express server
- **jsonwebtoken**: For token base authentication
- **stripe**: For payment
- **zod**: Data validation

## Starting express server

Create a configuration file named .env inside the `gateway` folder.Initialize the file with following variables.

```
PRIVATE_KEY = "jwt private key as per your choice"
STRIPE_PAYMENT_SECRET_KEY = "create stripe account and a project to get the stripe payment secret"
BASE_URL = http://localhost:8000
CUSTOMER_HOST_URL = "localhost:50052"
AUTHOR_HOST_URL = "localhost:50051"

```

To install all dependencies

```sh
cd server && npm install
```

# API Documentation

## `Baseurl`

- **Development**: http://localhost:8000

## `Endpoints`

To test the end-points follow the instructions below

### `Author Endpoints`

#### Register and authentication author

- **POST** `/api/author/sign-up`

Example of Request Body:

```json
{
  "name": "Rabindra",
  "email": "rabin1234@gmail.com",
  "password": "Rabin@1234",
  "genre": "FANTASY",
  "date_of_birth": "2003/09/12"
}
```

- **POST** `/api/author/sign-in`

Example:

```json
{
  "email": "rabin1234@gmail.com",
  "password": "Rabin@1234"
}
```

#### Author actions

- **GET** `/api/author/:authorId` (To get the author details)

- **PATCH** `/api/author/update/:authorId` (To update author details)

Example: Include only the fields to update

```json
{
  "name": "",
  "genre": ,
  "date_of_birth": ""
}
```

- **DELETE** `/api/author/:authorId` (To delete author account)
- **DELETE** `/api/author/signout/:authorId` (To sign out author account)

### `Books Endpoints`

#### BOOK CRUD

- **POST** `/api/books/add` (Add a book)

Example:

```json
{
  "bookName": "Harry Potter and the Philosopher's Stone",
  "genre": "Fantasy",
  "published_date": "1997-06-26",
  "price": 98,
  "stock": 10
}
```

- **PATCH** `/api/books/update/:bookId/:authorId` (Update a book)

Example: Include only the fields to update

```json
{
  // "bookName":"The Hidden Mysteryyyy121212121",
  // "genre":"fantasy",
  // "published_date":"2021/08/12"
  "price": 68.45
}
```

- **DELETE** `/api/books/delete/:bookId/:authorId` (Delete a book)

- **GETROUTES** : Take the reference of `gateway/route/book-route` for remaining get endpoints

## Books review endpoints

- **POST** `/api/review/add-book-review/:bookId` (Add review to a book)

Example:

```json
{
  "description": "I found the book quite interesting, this is my second review",
  "ratings": 5
}
```

- **PATCH** `/api/review/edit-book-review/:bookId/:reviewId` (To update book review)

Example:

```json
{
  "description": "",
  "ratings": ""
}
```

- **DELETE** `/api/review/delete-review/:bookId/:reviewId` (Delete review)

- **GET** `/api/review/get-reviews/:bookId` (Get all the reviews on a book)

## Customer endpoints

### Register and authentication

- **POST** `/api/customer/signup` (Sign up customer account)

Example:

```json
{
  "fullName": "John Starc",
  "email": "john10@gmail.com",
  "password": "John@123",
  "address": "NY-20",
  "dateOfBirth": "2004/09/19"
}
```

- **POST** `/api/customer/signin` (Sign in customer for authentication)

Example:

```json
{
  "email": "john10@gmail.com",
  "password": "John@123"
}
```

- **POST** `/api/customer/order-book/:bookId` (Order your favourite book)

Example:

```json
{
  "quantity": 2
}
```

- **DELETE** `/api/customer/cancel-order/:orderId` (Cancel the order)

- **GET** `/api/customer/order-payment/initiate/:orderId` (Initiate payment)
