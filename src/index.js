require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const api = require("api");
const app = new Koa();
const router = new Router();

const port = process.env.PORT || 4000;

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch(e => {
    console.log(e);
  });

router.use("/api", api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`listening port ${port}.`);
});
