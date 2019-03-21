const mongoose = require("mongoose");
const { Schema } = mongoose;

const Account = new Schema({
  profile: {
    email: String,
    username: String,
    id: String,
    introduce: String,
    thumbnail: { type: String, default: "/static/images/default_thumbnail.png" }
  },
  social: {
    git: {
      id: String,
      accessToken: String
    },
    google: {
      id: String,
      accessToken: String
    },
    facebook: {
      id: String,
      accessToken: String
    }
  },
  createdAt: { type: Date, default: Date.now }
});

Account.statics.findByEmail = function(email) {
  return this.findOne({ "profile.email": email });
};

module.exports = mongoose.model("Account", Account);
