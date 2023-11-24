const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
const { attachmentIcons } = require("./constants");

const sendEmail = async (props) => {
  return new Promise((resolve, reject) => {
    const {
      emailSubject,
      sendTo,
      sentFrom,
      replyTo,
      template,
      attachments,
      attachIcons,
      context,
    } = props;

    // other email configuration
    let transporter4Others = nodemailer.createTransport({
      host: process.env.EMAILHOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    //gmail configuration
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.GMAIL_APP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_APP_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./src/views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./src/views"),
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));

    const logoAttachment = [
      {
        filename: "unilag-logo-text.png",
        path: __dirname + "/../assets/email/unilag-logo-text.png",
        cid: "logo",
      },
    ];

    const attachmentWithIcons = [
      ...(logoAttachment || []),
      ...(attachmentIcons || []),
      ...(attachments || []),
    ];
    const attachmentWithoutIcons = [
      ...(logoAttachment || []),
      ...(attachments || []),
    ];

    // setup email data with unicode symbols
    let mailOptions = {
      from: {
        name: sentFrom.name,
        address: sentFrom.address,
      },
      to: `${sendTo}`,
      bcc: process.env.EMAIL_BCC,
      replyTo: replyTo ? replyTo : undefined,
      subject: emailSubject,
      text: process.env.EMAILTEXT,
      template: template,
      context: {
        year: new Date().getFullYear(),
        baseURL: process.env.BASEURL,
        companyName: process.env.COMPANYNAME,
        productName: process.env.PRODUCTNAME,
        customerCareLine: process.env.CUSTOMERCARELINE,
        ...context,
      },
      attachments: attachIcons ? attachmentWithIcons : attachmentWithoutIcons,
    };

    // Send mail with defined transport object
    transporter
      .sendMail(mailOptions)
      .then((info) => {
        const { accepted, response, envelope, messageId } = info;
        const data = {
          success: true,
          message: "Email sent successfully",
          accepted,
          envelope,
          response,
          messageId,
          previewURL: nodemailer.getTestMessageUrl(info),
        };
        resolve(data);
      })
      .catch((error) => {
        const data = {
          success: false,
          message: "Email could not be sent",
          error,
        };
        reject(data);
      });
  });
};

module.exports = sendEmail;