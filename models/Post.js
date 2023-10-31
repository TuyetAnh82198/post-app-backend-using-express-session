const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostsModel = new Schema({
  email: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("post", PostsModel);
