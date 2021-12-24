const nodemailer = require("nodemailer");

const sendEmail = async options => {
  //create transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  //define email options

  const mailOptions = {
      from: 'Ulan Dev <ulan@tour.io>', 
      to: options.email,
      subject: options.subject,
      text: options.message,
      //html: 
  }

  //send email with nodemailer
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
