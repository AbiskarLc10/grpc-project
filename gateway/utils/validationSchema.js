const { z } = require("zod");

const signUpSchema = z.object({
  name: z.string().min(5, "Name must have at least 5 characters"),
  email: z.string().email("Not a valid email address"),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must have a special character, a digit, and an uppercase letter"
    ),
  genre: z.enum(
    [
      "FANTASY",
      "CLASSICS",
      "DYSTOPIAN",
      "HISTORICAL_FICTION",
      "MYSTERY",
      "CONTEMPORARY_FICTION",
      "ADVENTURE",
    ],
    "Invalid genre"
  ),
  date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Must be a valid date string",
  }),
});

const addBookSchema = z.object({
  bookName: z.string().min(5, "Book must contain atleast 5 characters"),

  genre: z.enum(
    [
      "FANTASY",
      "CLASSICS",
      "DYSTOPIAN",
      "HISTORICAL_FICTION",
      "MYSTERY",
      "CONTEMPORARY_FICTION",
      "ADVENTURE",
      "FICTION",
    ],
    "Invalid genre"
  ),
  price: z
    .number("Price must be a valid number")
    .min(0, "Price must be a positive number")
    .refine((value) => value > 0, {
      message: "Price must be greater than 0",
    }),

  stock: z
    .number("Stock must be a valid number")
    .int("Stock must be an integer")
    .min(0, "Stock must be at least 0")
    .refine((value) => value >= 0, {
      message: "Stock must be a non-negative integer",
    }),
});
const UpdateBookSchema = z.object({
  bookName: z
    .string()
    .min(5, "Book must contain atleast 5 characters")
    .optional(),

  genre: z
    .enum(
      [
        "FANTASY",
        "CLASSICS",
        "DYSTOPIAN",
        "HISTORICAL_FICTION",
        "MYSTERY",
        "CONTEMPORARY_FICTION",
        "ADVENTURE",
        "FICTION",
      ],
      "Invalid genre"
    )
    .optional(),
  published_date: z.string().optional(),
  price: z.number("Price cannot be an string").optional(),
  stock: z
    .number("Stock cannot be an string")
    .refine((number) => Number.isInteger(number), {
      message: "Must be an integer",
    })
    .optional(),
});

const reviewSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  ratings: z
    .number("Please enter the ratings between 1 to 5")
    .min(1, "Rating cannot be less than 1")
    .max(5, "Max rating is 5")
    .optional(),
});

const dateTimeSchema = z.object({
  to: z.date().optional(),
  from: z.date(),
});

const signUpCustomerSchema = z.object({
  fullName: z.string().min(4, "Full name must be at least 4 characters"),
  email: z.string().email("Not a valid email address"),
  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must have a special character, a digit, and an uppercase letter"
    ),
  address: z.string(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Must be a valid date string",
  }),
});
module.exports = {
  signUpSchema,
  UpdateBookSchema,
  reviewSchema,
  dateTimeSchema,
  signUpCustomerSchema,
  addBookSchema,
};
