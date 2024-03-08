const attachmentIcons = [
  {
    filename: "icon-facebook.png",
    path: __dirname + "/../assets/email/icon-facebook.png",
    cid: "icon-facebook",
  },
  {
    filename: "icon-linkedin.png",
    path: __dirname + "/../assets/email/icon-linkedin.png",
    cid: "icon-linkedin",
  },
  {
    filename: "icon-twitter.png",
    path: __dirname + "/../assets/email/icon-twitter.png",
    cid: "icon-twitter",
  },
  {
    filename: "icon-instagram.png",
    path: __dirname + "/../assets/email/icon-instagram.png",
    cid: "icon-instagram",
  },
];

const COOKIES_VALIDITY_PERIOD = 30 // in minutes
const ACTIVITY_RESET_PASSWORD = "Reset password successfully";

module.exports = {
  attachmentIcons,
  COOKIES_VALIDITY_PERIOD,
  ACTIVITY_RESET_PASSWORD
};
