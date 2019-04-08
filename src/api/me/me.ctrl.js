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

exports.updateProfileLinks = async ctx => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .allow(""),
    github: Joi.string().allow(""),
    twitter: Joi.string().allow(""),
    facebook: Joi.string().allow(""),
    homepage: Joi.string().allow("")
  });

  console.log(ctx.request.body);

  const result = Joi.validate(ctx.request.body.profileLinks, schema);
  if (result.error) {
    ctx.status = 400;
    console.log(result.error);

    ctx.bodu = {
      name: "WRONG_SCHMEA",
      payload: result.error
    };
    return;
  }
  const { user } = ctx;
  const { profileLinks } = ctx.request.body;
  try {
    const account = await Account.findById(user._id);
    if (!account) {
      ctx.throw(500, "Invalid Profile");
    }

    account.profile.profile_links = profileLinks;
    await account.save();
    ctx.body = profileLinks;
  } catch (e) {
    console.log(500, e);
  }
};
