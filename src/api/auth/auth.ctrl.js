const Joi = require("joi");
const Account = require("models/account");
const { sendEmail } = require("lib/sendEmail");
const EmailAuth = require("models/emailAuth");
const { generateToken } = require("lib/token");

// 로컬 회원가입
exports.localRegister = async ctx => {
  const schema = Joi.object().keys({
    userId: Joi.string()
      .min(3)
      .max(16)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    useranme: Joi.string()
      .min(1)
      .max(40)
      .required(),
    short_intro: Joi.string()
  });

  const result = Joi.validate(ctx.body.request, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  let existing = null;
  try {
    existing = await Account.findBuEmailOrUsername(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (existing) {
    ctx.status = 409;
    ctx.body = {
      key: existing.email === ctx.request.body.email ? "email" : "userId"
    };
  }

  let account = null;
  try {
    account = await Account.localRegister(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  let token = null;
  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  });
  ctx.body = account.profile;
};

// 로컬 로그인
exports.localLogin = async ctx => {};

exports.check = ctx => {
  const { user } = ctx.request;
  if (!user) {
    ctx.status = 403;
    return;
  }

  ctx.body = user.profile;
};

exports.exists = async ctx => {
  const { key, value } = ctx.params;
  let account = null;

  try {
    account = await (key === "email"
      ? Account.findByEmail(value)
      : Account.findByUserId(value));
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: account !== null
  };
};

// 로그아웃
exports.logout = ctx => {
  ctx.cookies.set("accessToken", null, {
    maxAge: 0,
    httpOnly: true
  });

  ctx.status = 204;
};

// 인증메일 보내기
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

  const { email } = ctx.request.body;

  let user = null;
  try {
    user = await Account.findByEmail(email);
  } catch (e) {
    ctx.throw(500, e);
  }

  try {
    const emailKeywords = user
      ? {
          type: "login",
          text: "로그인"
        }
      : {
          type: "register",
          text: "회원가입"
        };

    const verification = await EmailAuth({ email }).save();

    sendEmail(
      email,
      `Velog ${emailKeywords.text}`,
      `<a href="http:localhost:3000"><img src="https://images.velog.io/email-logo.png" style="display: block; width: 128px; margin: 0 auto;"/></a>
      <div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
        <b style="black">안녕하세요! </b>${
          emailKeywords.text
        }을 계속하시려면 하단의 링크를 클릭하세요. 만약에 실수로 요청하셨거나, 본인이 요청하지 않았다면, 이 메일을 무시하세요.
      </div>
      
      <a href="http:localhost:3000/${emailKeywords.type}?code=${
        verification.code
      }" 
        style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">
      계속하기
      </a>
      
      <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;">
        <div>위 버튼을 클릭하시거나, 다음 링크를 열으세요: <br/>
           <a style="color: #b197fc;" href="http:localhost:3000/${
             emailKeywords.type
           }?code=${verification.code}">http:localhost:3000/${
        emailKeywords.type
      }?code=${verification.code}</a>
        </div>
        <br/>
        <div>이 링크는 24시간동안 유효합니다. </div>
      </div>`
    );
  } catch (e) {
    ctx.throw(500, e);
  }
};

exports.getCode = async ctx => {
  const { code } = ctx.params;

  try {
    const auth = await EmailAuth.findByCode(code);
    if (!auth) {
      ctx.status = 404;
      return;
    }

    const { email } = auth;

    const registerToken = await generateToken(
      { email },
      { expiresIn: "1h", subject: "auth-reigster" }
    );

    ctx.body = {
      email,
      registerToken
    };

    await auth.use();
  } catch (e) {
    ctx.throw(500, e);
  }
};
