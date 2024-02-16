const moment = require("moment/moment");
const jwt = require("jsonwebtoken");

const dateTime = () => moment().format("YYYY-MM-DD HH:mm:ss");
const date = () => moment().format("YYYY-MM-DD"); // get current Date
const time = () => moment().format("HH:mm:ss"); // get current time
const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7200, // 1 hr
  });
  return token;
};

// Function to generate a unique random number with 10 digits
const generateUniqueRandomNumber1 = () => {
  const timestamp = new Date().getTime(); // Get current timestamp
  const randomSuffix = Math.floor(Math.random() * 9000000000) + 1000000000; // Generate a random 9-digit number
  const uniqueRandomNumber = `${timestamp}${randomSuffix}`.slice(0, 10); // Combine timestamp and random number, then take the first 10 digits
  return uniqueRandomNumber;
};

const generateUniqueRandomNumber = () => {
  let lastNumber = 0;

    const timestamp = new Date().getTime(); // Get current timestamp
    let randomSuffix;

    do {
      randomSuffix = Math.floor(Math.random() * 9000000000) + 1000000000; // Generate a random 9-digit number
    } while (randomSuffix === lastNumber); // Ensure the new number is different from the previous one

    lastNumber = randomSuffix; // Update lastNumber with the current randomSuffix
    const uniqueRandomNumber = `${timestamp}${randomSuffix}`.slice(0, 10); // Combine timestamp and random number, then take the first 10 digits
    return uniqueRandomNumber;  
};

const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

module.exports = {
  dateTime,
  date,
  time,
  generateToken,
  createFolderIfNotExists,
  generateUniqueRandomNumber,
};
