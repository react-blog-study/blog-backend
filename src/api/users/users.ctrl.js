const Account = require("models/account");
const pick = require("lodash").pick;

exports.getUser = async (ctx, next) => {
  const { userId } = ctx.params;
  try {
    const user = await Account.findByUserId(userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        name: "USER_NOT_FOUND"
      };
      return;
    }

    ctx.selectedUser = user;
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
};
exports.getProfile = async ctx => {
  try {
    const profile = ctx.selectedUser.profile;

    ctx.body = {
      ...pick(profile, [
        "username",
        "short_intro",
        "long_intro",
        "thumbnaail",
        "profile_links"
      ]),
      userId: ctx.params.userId
    };
  } catch (e) {
    console.log(e);
  }
};

exports.getTags = async ctx => {};

exports.getHistory = async ctx => {};
