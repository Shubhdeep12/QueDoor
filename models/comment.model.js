const mongoose = require("mongoose");

const schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    image: { name: { type: String }, public_id: { type: String } },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    imageText: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
