const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UsersModel = new Schema({
  email: { type: String, required: true },
  pass: { type: String, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("user", UsersModel);
