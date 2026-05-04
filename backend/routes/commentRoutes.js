const express = require("express");
const router = express.Router();
const jwtmiddleware = require("../middleware/jwt");

const commentController = require("../controllers/commentController");

// ✅ Add comment
router.post("/comment/:postid", jwtmiddleware, commentController.addComment);

// ✅ Get comments of a particular post
router.get("/comment/:postid", commentController.getComments);

module.exports = router;