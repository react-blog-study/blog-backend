const nodemailer = require("nodemailer");

exports.sendEmail = (email, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "yuncheol92@gmail.com",
      pass: "dbscjf!234"
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
      console.log("Email sendt :" + info.response);
    }
  });
};
