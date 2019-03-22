const Joi = require("joi");
const Account = require("models/Account");
exports.sendAuthEmail = async ctx => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  let existing = null;
  try {
    existing = await Account.findByEmail(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (existing) {
    return (ctx.body = {
      idUser: true
    });
  } else {
    return (ctx.body = {
      isUser: false
    });
  }
};
