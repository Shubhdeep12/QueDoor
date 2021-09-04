const express = require("express");
const router = express.Router();
const controller = require("../controllers/home.controller");
const app = express();
const cors = require("cors");

app.use(cors());

//Home Screen getting all post
router.route("/:id").get(async (req, res) => {
  controller.getAllPosts(req, res);
});

//Adding Post
router.route("/:id/post").post(async (req, res) => {
  controller.addPost(req, res);
});

//Adding Comment
router.route("/:id/comment").post(async (req, res) => {
  controller.addComment(req, res);
});
//Deleting Comment
router.route("/:id/comment").delete(async (req, res) => {
  controller.deleteComment(req, res);
});
module.exports = router;
