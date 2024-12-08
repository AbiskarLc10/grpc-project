const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const { UpdateAuthor } = require("../Controllers/author-controllers");
const router = express.Router();

router.route("/update/:authorId").patch(verifyUser,UpdateAuthor);

module.exports = router;