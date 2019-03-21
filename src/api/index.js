const Router = require("koa-router");
const api = new Router();
const auth = require("./auth");
const post = require("./posts");

api.use("/auth", auth.routes());
api.use("/posts", post.routes());

module.exports = api;
