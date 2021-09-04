const mongoose = require("mongoose");

const schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: { name: { type: String }, public_id: { type: String } },
    text: {
      type: String,
      trim: true,
    },
    imageText: {
      type: String,
      trim: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
