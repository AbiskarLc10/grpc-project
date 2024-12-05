const { z } = require("zod");

const signUpSchema = z.object({
    name: z.string().min(5, "Name must have at least 5 characters"), 
    email: z.string().email("Not a valid email address"),
    password: z.string()
        .min(6, "Password must have at least 6 characters")
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "Password must have a special character, a digit, and an uppercase letter"),
    genre: z.enum(["FANTASY", "CLASSICS", "DYSTOPIAN", "HISTORICAL_FICTION", "MYSTERY", "CONTEMPORARY_FICTION", "ADVENTURE"], "Invalid genre"),
    date_of_birth: z.string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Must be a valid date string",
        })
})



module.exports = {signUpSchema}
