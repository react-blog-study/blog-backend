const Router = require("koa-router");
const api = new Router();
const auth = require("./auth");
const post = require("./posts");
const users = require("./users");
const me = require("./me");

api.use("/auth", auth.routes());
api.use("/posts", post.routes());
api.use("/users", users.routes());
api.use("/me", me.routes());

module.exports = api;
