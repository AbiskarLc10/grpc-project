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
        "FICTION"
      ],
      "Invalid genre"
    )
    .optional(),
  published_date: z.string().optional(),
});

const reviewSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  ratings: z.enum(
    ["EXTREMLY_BAD", "POOR", "AVERAGE", "GOOD", "EXCELLENT"],
    "Invalid ratings provided"
  ).optional(),
});

const dateTimeSchema = z.object({
  to: z.date().optional(),
  from: z.date(),
});

module.exports = {
  signUpSchema,
  UpdateBookSchema,
  reviewSchema,
  dateTimeSchema,
};
