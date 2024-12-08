const express = require("express");
const {
  SignUpAuthor,
  SignInAuthor,
} = require("../Controllers/auth-controllers");
const router = express.Router();

router.route("/sign-up").post(SignUpAuthor);
router.route("/sign-in").post(SignInAuthor);

module.exports = router;
