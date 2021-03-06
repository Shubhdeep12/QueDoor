const db = require("../models");
const express = require("express");
const app = express();
const cors = require("cors");
const { createWorker } = require("tesseract.js");
const worker = createWorker();
const mongoose = require("mongoose");
var v2cloudinary = require("cloudinary").v2;
const { uploader, cloudinaryConfig } = require("../config/cloudinary.config");

app.use(cors());
app.use("*", cloudinaryConfig);

//Home Screen getting all post
exports.getAllPosts = async (req, res) => {
  const user = await db.user.findById(req.params.id);
  const allPost = await db.posts
    .find({ _id: { $in: user.posts } })
    .sort({ _id: -1 });

  let finalPosts = [];
  for (let i = 0; i < allPost.length; i++) {
    let obj = { post: null, comments: [] };
    let m = allPost[i];
    obj.post = m;
    obj.comments = await db.comments.find({
      _id: { $in: allPost[i].comments },
    });
    finalPosts.push(obj);
  }

  try {
    let obj = {
      posts: finalPosts,
      user: await db.user.findById(mongoose.Types.ObjectId(req.params.id)),
    };

    res.status(200).send(obj);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

//Deleting Post
exports.deletePost = async (req, res) => {
  try {
    const post = await db.posts.findById(
      mongoose.Types.ObjectId(req.body.postid)
    );

    const user = await db.user.findById(mongoose.Types.ObjectId(req.params.id));

    if (post.name === user.name) {
      try {
        const result = await v2cloudinary.uploader.destroy(
          post.image.public_id
        );
        console.log(result);
      } catch (err) {}
      const userPost = await db.user.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.params.id),
        { $pull: { posts: post._id } },
        { safe: true, upsert: true }
      );

      const comment = await db.comments.deleteMany({
        postId: mongoose.Types.ObjectId(req.body.postid),
      });

      await post.deleteOne();

      res.status(200).send("the post has been deleted");
    } else {
      res.status(403).send("you can delete only your post");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

//Deleting Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await db.comments.findById(req.body.commentid);
    const user = await db.user.findById(comment.user);
    if (user._id.toString() === req.params.id) {
      try {
        const result = await v2cloudinary.uploader.destroy(
          comment.image.public_id
        );
        console.log(result);
      } catch (err) {}
      await comment.deleteOne();
      const userPost = await db.posts.findByIdAndUpdate(
        mongoose.Types.ObjectId(comment.postId),
        { $pull: { comments: comment._id } },
        { safe: true, upsert: true }
      );
      await db.user.findByIdAndUpdate(
        mongoose.Types.ObjectId(comment.commentid),
        { $pull: { comments: comment._id } },
        { safe: true, upsert: true }
      );

      res.status(200).send("the comment has been deleted");
    } else {
      res.status(403).send("you can delete only your comment");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
