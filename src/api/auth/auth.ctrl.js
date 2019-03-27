const Joi = require("joi");
const Account = require("models/account");
const sendEmail = require("lib/sendEmail").sendEmail;
// 로컬 회원가입

// 로컬 로그인

// 이메일

// 로그아웃

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

  console.log("email :: ", email);

  let user = null;
  try {
    user = await Account.findByEmail(email);
  } catch (e) {
    ctx.throw(500, e);
  }

  const emailKeywords = user
    ? {
        type: "email-login",
        text: "로그인"
      }
    : {
        type: "register",
        text: "회원가입"
      };

  try {
    sendEmail(
      email,
      `Velog ${emailKeywords.text}`,
      `<a href="https://velog.io"><img src="https://images.velog.io/email-logo.png" style="display: block; width: 128px; margin: 0 auto;"/></a>
      <div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;">
        <b style="black">안녕하세요! </b>${
          emailKeywords.text
        }을 계속하시려면 하단의 링크를 클릭하세요. 만약에 실수로 요청하셨거나, 본인이 요청하지 않았다면, 이 메일을 무시하세요.
      </div>
      
      <a href="https://velog.io/${emailKeywords.type}?code=code" 
        style="text-decoration: none; width: 400px; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;">
      계속하기
      </a>
      
      <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;">
        <div>위 버튼을 클릭하시거나, 다음 링크를 열으세요: <br/>
           <a style="color: #b197fc;" href="https://velog.io/${
             emailKeywords.type
           }?code=code">https://velog.io/${emailKeywords.type}?code=${
        verification.code
      }</a>
        </div>
        <br/>
        <div>이 링크는 24시간동안 유효합니다. </div>
      </div>`
    );
  } catch (e) {
    ctx.throw(500, e);
  }
};
