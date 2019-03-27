const Mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = Mongoose.Schema;

const EmailAuth = new Schema({
  code: {
    type: String,
    default: shortid.generate
  },
  email: String,
  logged: {
    type: Boolean,
    default: false
  }
});

EmailAuth.statics.findByCode = function(code) {
  return this.findOne({ code, logged: false });
};

EmailAuth.methods.use = function() {
  this.logged = true;
  return this.save();
};

module.exports = Mongoose.model("EmailAuth", EmailAuth);
