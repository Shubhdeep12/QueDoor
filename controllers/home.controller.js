const db = require("../models");
const express = require("express");
const app = express();
const cors = require("cors");
//const { createWorker } = require("tesseract.js");
const Tesseract = require("tesseract.js");
const mongoose = require("mongoose");
//const fetch = require("node-fetch");
require("dotenv").config();
var v2cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../config/cloudinary.config");

app.use(cors());
app.use("*", cloudinaryConfig);

//Home Screen getting all post
exports.getAllPosts = async (req, res) => {
  const allPost = await db.posts.find().sort({ _id: -1 });
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

    res.send(obj);
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
};

//Adding Post
exports.addPost = async (req, res) => {
  const postext = req.body.text;
  let imagetext = "";
  let name = await db.user.findById(
    mongoose.Types.ObjectId(req.params.id),
    function (err, user) {
      if (err) {
        return "Guest";
      }
      if (user) {
        return user.name;
      }
    }
  );
  name = name.name;
  let img = { name: "", public_id: "" };
  (async () => {
    try {
      img.name = req.body.img.name;
      img.public_id = req.body.img.public_id;

      if (img.name === undefined || img.name === null) {
        throw Error();
      }
      var { data } = await Tesseract.recognize(img.name, "eng");
      imagetext = data.text;
    } catch (err) {
      console.log("1" + err);
      img = { name: "", public_id: "" };
      imagetext = "";
    }
    try {
      await worker.terminate();
    } catch (err) {}
    const comments = [];

    const newPost = new db.posts({
      text: postext,
      image: img,
      name: name,
      imageText: imagetext,
      comments: comments,
    });
    try {
      const result = await newPost.save();
      db.user.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.params.id),
        { $push: { posts: newPost._id } },
        { safe: true, upsert: true },
        function (err, doc) {
          if (err) {
            return res.status(500).json("Error:" + err);
          } else {
            res.send("Post added");
          }
        }
      );
    } catch (err) {
      return res.status(500).json("Error:" + err);
    }
  })();
};

//Adding comments
exports.addComment = async (req, res) => {
  const postid = req.body.postid;
  const comtext = req.body.text;
  let comname = await db.user.findById(
    mongoose.Types.ObjectId(req.params.id),
    function (err, user) {
      if (err) {
        return "Guest";
      }
      if (user) {
        return user.name;
      }
    }
  );
  comname = comname.name;
  let comimg = { name: "", public_id: "" };
  (async () => {
    try {
      comimg.name = req.body.img.name;
      comimg.public_id = req.body.img.public_id;
      if (comimg.name === undefined || comimg.name === null) {
        throw Error();
      }

      // const response = await fetch(comimg.name);
      // const buffer = await response.buffer();

      var { data } = await Tesseract.recognize(comimg.name, "eng");
      comimagetext = data.text;
    } catch (err) {
      console.log(err);
      comimg = { name: "", public_id: "" };
      comimagetext = "";
    }

    try {
      await worker.terminate();
    } catch (err) {}
    const userid = await db.user.findOne(
      mongoose.Types.ObjectId(req.params.id)
    );
    const newComment = new db.comments({
      text: comtext,
      image: comimg,
      postId: postid,
      imageText: comimagetext,
      user: userid,
      name: comname,
    });
    try {
      const result = await newComment.save();
      db.posts.findByIdAndUpdate(
        mongoose.Types.ObjectId(postid),
        { $push: { comments: newComment._id } },
        { safe: true, upsert: true },
        function (err, doc) {
          if (err) {
            return res.status(500).json("Error:" + err);
          } else {
            //console.log("DONE");
            res.send("comment added");
          }
        }
      );
    } catch (err) {
      //console.log(err);
      return res.status(500).json("Error:" + err);
    }
  })();
};

//Deleting Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await db.comments.findById(req.body.commentid);
    const user = await db.user.findById(comment.user);
    if (user._id.toString() === req.params.id) {
      const result = await v2cloudinary.uploader.destroy(
        comment.image.public_id
      );
      console.log(result);
      await comment.deleteOne();
      const userPost = await db.posts.findByIdAndUpdate(
        mongoose.Types.ObjectId(comment.postId),
        { $pull: { comments: comment._id } },
        { safe: true, upsert: true }
      );

      res.send("the comment has been deleted");
    } else {
      res.status(403).json("you can delete only your comment");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
