const Router = require("koa-router");
const auth = new Router();
const authCtrl = require("./auth.ctrl");

auth.post("/send-auth-email", authCtrl.sendAuthEmail);
auth.post("/register/local", authCtrl.localRegister);
auth.post("/login/local", authCtrl.localLogin);
auth.get("/exists/:key(email|username)/:value", authCtrl.exists);
auth.post("/logout", authCtrl.logout);
auth.get("/check", authCtrl.check);
auth.get("/code/:code", authCtrl.getCode);
module.exports = auth;
