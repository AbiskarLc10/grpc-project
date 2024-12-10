const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const { UpdateAuthor,DeleteAuthor, SignOutAuthor, getAuthorById } = require("../Controllers/author-controllers");
const router = express.Router();

router.route("/update/:authorId").patch(verifyUser,UpdateAuthor);
router.route("/delete/:authorId").delete(verifyUser,DeleteAuthor);
router.route("/sign-out/:authorId").delete(verifyUser,SignOutAuthor);
router.route("/:authorId").get(verifyUser,getAuthorById)

module.exports = router;