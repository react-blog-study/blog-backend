const mongoose = require("mongoose");
const { Schema } = mongoose;

const Account = new Schema({
  profile: {
    email: String,
    username: String,
    userId: String,
    short_intro: String,
    long_intro: String,
    thumbnail: { type: String, default: "/static/images/default_thumbnail.png" }
  },
  social: {
    git: {
      url: String,
      accessToken: String
    },
    google: {
      url: String,
      accessToken: String
    },
    facebook: {
      url: String,
      accessToken: String
    }
  },
  homepage: String,
  createdAt: { type: Date, default: Date.now },
  del_yn: { type: Boolean, default: false }
});

Account.statics.findByUserId = function(userId) {
  return this.fineOne({ "profile.userId": userId }).exec();
};

Account.statics.findByEmail = function(email) {
  return this.findOne({ "profile.email": email });
};

// 회원가입
Account.statics.localRegister = function(email) {
  const account = new this({
    profile: {
      email
    }
  });

  return account.save();
};

module.exports = mongoose.model("Account", Account);
