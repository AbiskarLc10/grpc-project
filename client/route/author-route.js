const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const { UpdateAuthor,DeleteAuthor, SignOutAuthor } = require("../Controllers/author-controllers");
const router = express.Router();

router.route("/update/:authorId").patch(verifyUser,UpdateAuthor);
router.route("/delete/:authorId").delete(verifyUser,DeleteAuthor);
router.route("/sign-out/:authorId").delete(verifyUser,SignOutAuthor);

module.exports = router;