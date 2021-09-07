const express = require("express");
const app = express();
const cors = require("cors");
// const fetch = require("node-fetch");
var stringSimilarity = require("string-similarity");
const db = require("../models");
const mongoose = require("mongoose");
const Tesseract = require("tesseract.js");
const { cloudinaryConfig } = require("../config/cloudinary.config");
var v2cloudinary = require("cloudinary").v2;

app.use(cors());
app.use("*", cloudinaryConfig);

exports.filter = async (req, res) => {
  let imagetext = "";
  let postext = req.body.text ? req.body.text : " ";
  let img = { name: "", public_id: "" };
  try {
    img.name = req.body.img.name;
    img.public_id = req.body.img.public_id;
    if (img.name === undefined || img.name === null) {
      throw Error();
    }
    var { data } = await Tesseract.recognize(img.name, "eng");
    imagetext = data.text;
  } catch (err) {
    //console.log(err);
    img = { name: "", public_id: "" };
    imagetext = "";
  }
  try {
    await worker.terminate();
  } catch (err) {}

  try {
    const result = await v2cloudinary.uploader.destroy(req.body.img.public_id);
    console.log(result);
  } catch (err) {}
  let count = 1;
  if (postext.length > 2 && imagetext.length > 2) {
    count = 2;
  }
  try {
    let allPost = await db.posts.find();

    allPost
      .sort((a, b) => {
        let valA =
          ((imagetext.length > 1 &&
            stringSimilarity.compareTwoStrings(imagetext, a.imageText)) +
            (postext.length > 1 &&
              stringSimilarity.compareTwoStrings(postext, a.text))) /
          count;
        let valB =
          ((imagetext.length > 1 &&
            stringSimilarity.compareTwoStrings(imagetext, b.imageText)) +
            (postext.length > 1 &&
              stringSimilarity.compareTwoStrings(postext, b.text))) /
          count;

        if (valA > valB) {
          return 1;
        } else if (valA < valB) {
          return -1;
        }
        return 0;
      })
      .reverse();
    let finalPosts = [];
    for (let i = 0; i < allPost.length; i++) {
      let obj = { post: null, comments: [] };
      let m = allPost[i];
      obj.post = m;
      for (let j = 0; j < m.comments.length; j++) {
        try {
          let comment = await db.comments.findById(m.comments[j]);
          obj.comments.push(comment);
        } catch (err) {
          console.log(err);
        }
      }
      finalPosts.push(obj);
    }

    try {
      let obj = {
        posts: finalPosts,
        user: await db.user.findById(mongoose.Types.ObjectId(req.params.id)),
      };
      res.status(200).json(obj);
    } catch (err) {
      res.status(500).json("Error: " + err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
