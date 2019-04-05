const mongoose = require("mongoose");
const { Schema } = mongoose;
const { generateToken } = require("lib/token");
const Account = new Schema({
  profile: {
    username: String,
    email: String,
    userId: String,
    short_intro: String,
    long_intro: String,
    profile_links: {
      email: String,
      github: String,
      twitter: String,
      facebook: String
    },
    thumbnail: { type: String, default: "static/images/default_thumbnail.png" }
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

  createdAt: { type: Date, default: Date.now },
  del_yn: { type: Boolean, default: false }
});

Account.statics.findByUserId = function(userId) {
  return this.findOne({ "profile.userId": userId }).exec();
};

Account.statics.findByEmail = function(email) {
  return this.findOne({ "profile.email": email });
};

Account.statics.findByEmailOrUserId = function({ userId, email }) {
  return this.findOne({
    $or: [{ "profile.userId": userId }, { "profile.email": email }]
  }).exec();
};

// 회원가입
Account.statics.localRegister = function({
  username,
  email,
  userId,
  short_intro
}) {
  const account = new this({
    profile: {
      username,
      email,
      userId,
      short_intro
    }
  });

  return account.save();
};

Account.methods.generateToken = function() {
  const payload = {
    _id: this._id,
    profile: this.profile
  };

  return generateToken(payload);
};

Account.methods.updateProfile = function(user, { username, short_intro }) {
  return this.update(
    user._id,
    {
      $set: {
        "profile.username": username,
        "profile.shotr_intro": short_intro
      }
    },
    { new: true }
  ).exec();
};

module.exports = mongoose.model("Account", Account);
