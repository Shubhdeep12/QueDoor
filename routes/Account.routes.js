const express = require("express");
const router = express.Router();
const controller = require("../controllers/account.controller");
const app = express();
const cors = require("cors");

app.use(cors());

//Account Screen getting all post for user
router.route("/:id").get(async (req, res) => {
  controller.getAllPosts(req, res);
});

//Deleting Post
router.route("/:id/post").delete(async (req, res) => {
  controller.deletePost(req, res);
});

//Deleting Comment
router.route("/:id/comment").delete(async (req, res) => {
  controller.deleteComment(req, res);
});

module.exports = router;
