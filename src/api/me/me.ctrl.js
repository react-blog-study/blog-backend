const Joi = require("joi");
const Account = require("models/account");

exports.updateProfile = async ctx => {
  const { user } = ctx;

  const schema = Joi.object().keys({
    username: Joi.string()
      .min(1)
      .max(40),
    short_intro: Joi.string()
      .allow("")
      .max(140)
  });

  const reuslt = Joi.validate(ctx.request.body, schema);
  if (reuslt.error) {
    ctx.status = 400;
    ctx.body = {
      name: "WRONG_SCHEMA",
      payload: reuslt.error
    };

    return;
  }

  const { username, short_intro } = ctx.request.body;

  if (!username && !username.trim()) {
    ctx.status = 400;
    ctx.body = {
      name: "INVALID_NAME"
    };

    return;
  }

  let account = null;
  try {
    account = await Account.findByIdAndUpdate(
      user._id,
      {
        $set: {
          "profile.username": username,
          "profile.short_intro": short_intro
        }
      },
      { new: true }
    ).exec();
  } catch (e) {
    ctx.throw(500, e);
  }
  ctx.body = account.profile;
};
