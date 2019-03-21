const Router = require("koa-router");
const auth = new Router();
const authCtrl = require("./auth.ctrl");

auth.post("/send-auth-email", authCtrl.sendAuthEmail);

module.exports = auth;
