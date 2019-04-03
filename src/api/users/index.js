const Router = require("koa-router");
const user = new Router();
const users = new Router();
const usersCtrl = require("./users.ctrl");

user.get("/", usersCtrl.getProfile);
user.get("/tags", usersCtrl.getTags);
user.get("/history", usersCtrl.getHistory);
users.use("/@:userId", usersCtrl.getUser, user.routes());

module.exports = users;
