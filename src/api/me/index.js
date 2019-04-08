const Router = require("koa-router");
const meCtrl = require("./me.ctrl");
const me = new Router();

me.patch("/profile", meCtrl.updateProfile);
me.patch("/profile-links", meCtrl.updateProfileLinks);

module.exports = me;
