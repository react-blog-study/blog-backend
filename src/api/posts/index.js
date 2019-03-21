const Router = require("koa-router");
const posts = new Router();
const postCtrl = require("./posts.ctrl");

posts.post("/write", postCtrl.write);

posts.post("/temp-save", postCtrl.tempSave);

posts.get("/list", postCtrl.list);

posts.get("/:postId", postCtrl.view);

posts.delete("/:postId", postCtrl.delete);

posts.put("/:postId", postCtrl.update);

module.exports = posts;
