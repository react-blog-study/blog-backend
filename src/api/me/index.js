const Router = require("koa-router");
const meCtrl = require("./me.ctrl");
const me = new Router();

me.patch("/profile", meCtrl.updateProfile);

module.exports = me;
