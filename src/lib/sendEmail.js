const nodemailer = require("nodemailer");

exports.sendEmail = (email, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PW
    }
  });

  const mailOptions = {
    from: "yuncheol92@gmail.com",
    to: email,
    subject: subject,
    html: content
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email send :" + info.response);
    }
  });
};
