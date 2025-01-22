/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.setOptions({
  syntax: "proto3"
})
.addJSON({
  author: {
    nested: {
      SignUpRequest: {
        fields: {
          name: {
            type: "string",
            id: 1
          },
          email: {
            type: "string",
            id: 2
          },
          password: {
            type: "string",
            id: 3
          },
          genre: {
            type: "Genre",
            id: 4
          },
          dateOfBirth: {
            type: "string",
            id: 5
          }
        }
      },
      SignUpResponse: {
        fields: {
          author: {
            type: "Author",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          }
        }
      },
      SignInResponse: {
        fields: {
          author: {
            type: "Author",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          }
        }
      },
      UpdateProfileRequest: {
        oneofs: {
          genreChoice: {
            oneof: [
              "genre"
            ]
          }
        },
        fields: {
          id: {
            type: "string",
            id: 1
          },
          name: {
            type: "string",
            id: 2
          },
          genre: {
            type: "Genre",
            id: 3
          },
          dateOfBirth: {
            type: "string",
            id: 4
          }
        }
      },
      UpdateProfileResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          }
        }
      },
      DeleteProfileRequest: {
        fields: {
          id: {
            type: "string",
            id: 1
          }
        }
      },
      DeleteProfileResponse: {
        fields: {
          success: {
            type: "bool",
            id: 1
          }
        }
      },
      GetAuthorRequest: {
        fields: {
          authorId: {
            type: "string",
            id: 1
          }
        }
      },
      GetAuthorResponse: {
        fields: {
          author: {
            type: "Author",
            id: 1
          }
        }
      },
      GoogleAuthRequest: {
        fields: {
          name: {
            type: "string",
            id: 1
          },
          email: {
            type: "string",
            id: 2
          },
          dateOfBirth: {
            type: "string",
            id: 3
          },
          genre: {
            type: "Genre",
            id: 4
          },
          profileImage: {
            type: "string",
            id: 5
          }
        }
      },
      AuthorService: {
        methods: {
          SignUp: {
            requestType: "SignUpRequest",
            responseType: "SignUpResponse"
          },
          SignIn: {
            requestType: "SignInRequest",
            responseType: "SignInResponse"
          },
          GoogleAuthentication: {
            requestType: "GoogleAuthRequest",
            responseType: "SignInResponse"
          },
          UpdateProfile: {
            requestType: "UpdateProfileRequest",
            responseType: "UpdateProfileResponse"
          },
          DeleteProfile: {
            requestType: "DeleteProfileRequest",
            responseType: "DeleteProfileResponse"
          },
          GetAuthorById: {
            requestType: "GetAuthorRequest",
            responseType: "GetAuthorResponse"
          }
        }
      }
    }
  },
  Genre: {
    values: {
      FANTASY: 0,
      CLASSICS: 1,
      DYSTOPIAN: 2,
      HISTORICAL_FICTION: 3,
      MYSTERY: 4,
      CONTEMPORARY_FICTION: 5,
      ADVENTURE: 6,
      FICTION: 7
    }
  },
  Author: {
    oneofs: {
      _profileImage: {
        oneof: [
          "profileImage"
        ]
      }
    },
    fields: {
      id: {
        type: "string",
        id: 1
      },
      name: {
        type: "string",
        id: 2
      },
      email: {
        type: "string",
        id: 3
      },
      dateOfBirth: {
        type: "string",
        id: 4
      },
      genre: {
        type: "Genre",
        id: 5
      },
      profileImage: {
        type: "string",
        id: 6,
        options: {
          proto3_optional: true
        }
      }
    }
  },
  SignInRequest: {
    fields: {
      email: {
        type: "string",
        id: 1
      },
      password: {
        type: "string",
        id: 2
      }
    }
  },
  Book: {
    oneofs: {
      authorInfo: {
        oneof: [
          "authorName"
        ]
      }
    },
    fields: {
      id: {
        type: "string",
        id: 1
      },
      bookName: {
        type: "string",
        id: 2
      },
      genre: {
        type: "Genre",
        id: 3
      },
      authorId: {
        type: "string",
        id: 4
      },
      publishedDate: {
        type: "string",
        id: 5
      },
      averageRatings: {
        type: "double",
        id: 6
      },
      authorName: {
        type: "string",
        id: 7
      },
      price: {
        type: "double",
        id: 8
      },
      stock: {
        type: "int32",
        id: 9
      }
    }
  },
  UserStatus: {
    values: {
      ACTIVE: 0,
      INACTIVE: 1,
      SUSPENDED: 2
    }
  },
  OrderStatus: {
    values: {
      PENDING: 0,
      FAILED: 1,
      DELIVERED: 2
    }
  },
  Customer: {
    fields: {
      id: {
        type: "string",
        id: 1
      },
      fullName: {
        type: "string",
        id: 2
      },
      email: {
        type: "string",
        id: 3
      },
      address: {
        type: "string",
        id: 4
      },
      dateOfBirth: {
        type: "string",
        id: 5
      },
      status: {
        type: "UserStatus",
        id: 6
      }
    }
  },
  Order: {
    fields: {
      id: {
        type: "string",
        id: 1
      },
      bookId: {
        type: "string",
        id: 2
      },
      customerId: {
        type: "string",
        id: 3
      },
      price: {
        type: "double",
        id: 4
      },
      quantity: {
        type: "int32",
        id: 5
      },
      status: {
        type: "OrderStatus",
        id: 6
      }
    }
  },
  book: {
    nested: {
      GetAllBookRequest: {
        fields: {}
      },
      GetAllBookResponse: {
        fields: {
          books: {
            rule: "repeated",
            type: "Book",
            id: 1
          }
        }
      },
      GetBookByAuthorRequest: {
        fields: {
          author: {
            type: "string",
            id: 1
          }
        }
      },
      GetBookByAuthorResponse: {
        fields: {
          books: {
            rule: "repeated",
            type: "Book",
            id: 1
          }
        }
      },
      GetBookByIdRequest: {
        fields: {
          bookId: {
            type: "string",
            id: 1
          }
        }
      },
      GetBookByIdResponse: {
        fields: {
          book: {
            type: "Book",
            id: 1
          }
        }
      },
      AddBookRequest: {
        fields: {
          bookName: {
            type: "string",
            id: 1
          },
          genre: {
            type: "Genre",
            id: 2
          },
          authorId: {
            type: "string",
            id: 3
          },
          publishedDate: {
            type: "string",
            id: 4
          },
          price: {
            type: "double",
            id: 5
          }
        }
      },
      AddBookResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          }
        }
      },
      DeleteBookRequest: {
        fields: {
          bookId: {
            type: "string",
            id: 1
          }
        }
      },
      DeleteBookResponse: {
        fields: {
          success: {
            type: "bool",
            id: 1
          }
        }
      },
      UpdateBookRequest: {
        oneofs: {
          _bookName: {
            oneof: [
              "bookName"
            ]
          },
          _genre: {
            oneof: [
              "genre"
            ]
          },
          _publishedDate: {
            oneof: [
              "publishedDate"
            ]
          },
          _price: {
            oneof: [
              "price"
            ]
          }
        },
        fields: {
          bookId: {
            type: "string",
            id: 1
          },
          bookName: {
            type: "string",
            id: 2,
            options: {
              proto3_optional: true
            }
          },
          genre: {
            type: "Genre",
            id: 3,
            options: {
              proto3_optional: true
            }
          },
          publishedDate: {
            type: "string",
            id: 4,
            options: {
              proto3_optional: true
            }
          },
          price: {
            type: "double",
            id: 5,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      UpdateBookResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          }
        }
      },
      GetBookByDateRequest: {
        fields: {
          from: {
            type: "string",
            id: 1
          },
          to: {
            type: "string",
            id: 2
          }
        }
      },
      GetBookByDateResponse: {
        fields: {
          books: {
            rule: "repeated",
            type: "Book",
            id: 1
          }
        }
      },
      GetBooksPerPageRequest: {
        fields: {
          pageNo: {
            type: "int32",
            id: 1
          }
        }
      },
      GetBooksPerPageResponse: {
        fields: {
          books: {
            rule: "repeated",
            type: "Book",
            id: 1
          }
        }
      },
      GetStreamDataRequest: {
        fields: {}
      },
      BookService: {
        methods: {
          AddBook: {
            requestType: "AddBookRequest",
            responseType: "AddBookResponse"
          },
          DeleteBook: {
            requestType: "DeleteBookRequest",
            responseType: "DeleteBookResponse"
          },
          GetAllBook: {
            requestType: "GetAllBookRequest",
            responseType: "GetAllBookResponse"
          },
          GetBookByAuthor: {
            requestType: "GetBookByAuthorRequest",
            responseType: "GetBookByAuthorResponse"
          },
          GetBookById: {
            requestType: "GetBookByIdRequest",
            responseType: "GetBookByIdResponse"
          },
          UpdateBook: {
            requestType: "UpdateBookRequest",
            responseType: "UpdateBookResponse"
          },
          GetBookByDate: {
            requestType: "GetBookByDateRequest",
            responseType: "GetBookByDateResponse"
          },
          GetBooksPerPage: {
            requestType: "GetBooksPerPageRequest",
            responseType: "GetBooksPerPageResponse"
          },
          GetStreamData: {
            requestType: "GetStreamDataRequest",
            responseType: "GetBookByIdResponse",
            responseStream: true
          }
        }
      }
    }
  },
  customer: {
    nested: {
      SignUpCustomerRequest: {
        fields: {
          fullName: {
            type: "string",
            id: 1
          },
          email: {
            type: "string",
            id: 2
          },
          password: {
            type: "string",
            id: 3
          },
          address: {
            type: "string",
            id: 4
          },
          dateOfBirth: {
            type: "string",
            id: 5
          }
        }
      },
      SignUpCustomerResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          }
        }
      },
      SignInCustomerResponse: {
        fields: {
          customer: {
            type: "Customer",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          },
          token: {
            type: "string",
            id: 3
          }
        }
      },
      OrderBookRequest: {
        fields: {
          bookId: {
            type: "string",
            id: 1
          },
          quantity: {
            type: "int32",
            id: 3
          }
        }
      },
      OrderBookResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          },
          order: {
            type: "Order",
            id: 2
          }
        }
      },
      CancelBookOrderRequest: {
        fields: {
          orderId: {
            type: "string",
            id: 1
          }
        }
      },
      CancelBookOrderResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          }
        }
      },
      GetOrderDetailsRequest: {
        fields: {
          orderId: {
            type: "string",
            id: 1
          }
        }
      },
      GetOrderDetailsResponse: {
        fields: {
          order: {
            type: "Order",
            id: 1
          }
        }
      },
      CustomerGoogleAuthRequest: {
        fields: {
          fullName: {
            type: "string",
            id: 1
          },
          email: {
            type: "string",
            id: 2
          },
          profileImage: {
            type: "string",
            id: 3
          },
          address: {
            type: "string",
            id: 4
          },
          dateOfBirth: {
            type: "string",
            id: 5
          }
        }
      },
      CustomerService: {
        methods: {
          SignUpCustomer: {
            requestType: "SignUpCustomerRequest",
            responseType: "SignUpCustomerResponse"
          },
          SignInCustomer: {
            requestType: "SignInRequest",
            responseType: "SignInCustomerResponse"
          },
          OrderBook: {
            requestType: "OrderBookRequest",
            responseType: "OrderBookResponse"
          },
          CancelBookOrder: {
            requestType: "CancelBookOrderRequest",
            responseType: "CancelBookOrderResponse"
          },
          GetOrderDetails: {
            requestType: "GetOrderDetailsRequest",
            responseType: "GetOrderDetailsResponse"
          },
          CustomerGoogleAuthentication: {
            requestType: "CustomerGoogleAuthRequest",
            responseType: "SignInCustomerResponse"
          }
        }
      }
    }
  },
  payment: {
    nested: {
      PaymentStatus: {
        values: {
          PENDING: 1,
          COMPLETED: 2,
          FAILED: 3,
          REFUNDED: 4
        }
      },
      Payment: {
        fields: {
          id: {
            type: "string",
            id: 1
          },
          orderId: {
            type: "string",
            id: 2
          },
          totalAmount: {
            type: "double",
            id: 3
          },
          paymentStatus: {
            type: "PaymentStatus",
            id: 4
          },
          paymentIntendId: {
            type: "string",
            id: 5
          },
          paymentMethodId: {
            type: "string",
            id: 6
          }
        }
      },
      InitiateOrderPaymentRequest: {
        fields: {
          orderId: {
            type: "string",
            id: 1
          }
        }
      },
      InitiateOrderPaymentResponse: {
        fields: {
          paymentDetails: {
            type: "Payment",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          },
          bookName: {
            type: "string",
            id: 3
          },
          quantity: {
            type: "int32",
            id: 4
          },
          price: {
            type: "double",
            id: 5
          }
        }
      },
      PaymentSuccessRequest: {
        fields: {
          orderId: {
            type: "string",
            id: 1
          },
          paymentId: {
            type: "string",
            id: 2
          },
          paymentIntendId: {
            type: "string",
            id: 3
          },
          paymentMethodId: {
            type: "string",
            id: 4
          }
        }
      },
      PaymentSuccessResponse: {
        fields: {
          success: {
            type: "bool",
            id: 1
          },
          message: {
            type: "string",
            id: 2
          }
        }
      },
      PaymentCancelRequest: {
        fields: {
          orderId: {
            type: "string",
            id: 1
          },
          paymentId: {
            type: "string",
            id: 2
          }
        }
      },
      PaymentCancelResponse: {
        fields: {
          success: {
            type: "bool",
            id: 1
          },
          message: {
            type: "string",
            id: 2
          }
        }
      },
      GetPaymentDetailsByIdRequest: {
        fields: {
          paymentId: {
            type: "string",
            id: 1
          }
        }
      },
      GetPaymentDetailsByIdResponse: {
        fields: {
          payment: {
            keyType: "string",
            type: "Payment",
            id: 1
          },
          bookName: {
            type: "string",
            id: 2
          },
          customerName: {
            type: "string",
            id: 3
          },
          paymentMethod: {
            type: "string",
            id: 4
          }
        }
      },
      PaymentService: {
        methods: {
          InitiateOrderPayment: {
            requestType: "InitiateOrderPaymentRequest",
            responseType: "InitiateOrderPaymentResponse"
          },
          PaymentSuccess: {
            requestType: "PaymentSuccessRequest",
            responseType: "PaymentSuccessResponse"
          },
          PaymentCancel: {
            requestType: "PaymentCancelRequest",
            responseType: "PaymentCancelResponse"
          },
          GetPaymentDetailsById: {
            requestType: "GetPaymentDetailsByIdRequest",
            responseType: "GetPaymentDetailsByIdResponse"
          }
        }
      }
    }
  },
  review: {
    nested: {
      BookReview: {
        fields: {
          reviewerId: {
            type: "string",
            id: 1
          },
          bookId: {
            type: "string",
            id: 2
          },
          description: {
            type: "string",
            id: 3
          },
          ratings: {
            type: "double",
            id: 4
          },
          bookName: {
            type: "string",
            id: 5
          },
          reviewerType: {
            type: "ReviewerType",
            id: 6
          }
        }
      },
      ReviewerType: {
        values: {
          CUSTOMER: 0,
          AUTHOR: 1
        }
      },
      AddBookReviewRequest: {
        fields: {
          review: {
            type: "BookReview",
            id: 1
          }
        }
      },
      AddBookReviewResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          },
          bookName: {
            type: "string",
            id: 2
          },
          description: {
            type: "string",
            id: 3
          },
          ratings: {
            type: "double",
            id: 4
          },
          reviewerType: {
            type: "ReviewerType",
            id: 5
          }
        }
      },
      DeleteBookReviewRequest: {
        fields: {
          reviewId: {
            type: "string",
            id: 1
          },
          reviewerId: {
            type: "string",
            id: 2
          },
          bookId: {
            type: "string",
            id: 3
          }
        }
      },
      DeleteBookReviewResponse: {
        fields: {
          success: {
            type: "bool",
            id: 1
          }
        }
      },
      EditBookReviewRequest: {
        fields: {
          reviewId: {
            type: "string",
            id: 1
          },
          reviewerId: {
            type: "string",
            id: 2
          },
          bookId: {
            type: "string",
            id: 3
          },
          description: {
            type: "string",
            id: 4
          },
          ratings: {
            type: "double",
            id: 5
          }
        }
      },
      EditBookReviewResponse: {
        fields: {
          message: {
            type: "string",
            id: 1
          },
          success: {
            type: "bool",
            id: 2
          }
        }
      },
      GetAllReviewsRequest: {
        fields: {
          bookId: {
            type: "string",
            id: 1
          }
        }
      },
      GetAllReviewsResponse: {
        fields: {
          reviews: {
            rule: "repeated",
            type: "BookReview",
            id: 1
          }
        }
      },
      ReviewService: {
        methods: {
          AddBookReview: {
            requestType: "AddBookReviewRequest",
            responseType: "AddBookReviewResponse"
          },
          DeleteBookReview: {
            requestType: "DeleteBookReviewRequest",
            responseType: "DeleteBookReviewResponse"
          },
          EditBookReview: {
            requestType: "EditBookReviewRequest",
            responseType: "EditBookReviewResponse"
          },
          GetAllReviews: {
            requestType: "GetAllReviewsRequest",
            responseType: "GetAllReviewsResponse"
          }
        }
      }
    }
  }
});

module.exports = $root;
