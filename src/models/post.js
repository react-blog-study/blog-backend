const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema({
  userId: String,
  tilte: String,
  content: String,
  createdDate: { type: Date, default: Date.now },
  visitCount: number
});

module.exports = mongoose.model("Post", Post);
