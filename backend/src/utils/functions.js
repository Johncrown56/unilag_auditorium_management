const moment = require("moment/moment");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const bcrypt = require("bcryptjs");


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
    maxAge: 7200, // 2 hr
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

const encrypt = (text) => {
  const encryptionKey = process.env.CRYPTO_SECRET;
  // Ensure correct key length
  const validKey = Buffer.alloc(32, encryptionKey, 'utf-8');

  const ivLength = 16;
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv('aes-256-cbc', validKey, iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':ai' + encrypted.toString('hex');
}

const decrypt = (encryptedData) => {
  const encryptionKey = process.env.CRYPTO_SECRET;

  // Ensure correct key length
  const validKey = Buffer.alloc(32, encryptionKey, 'utf-8');

  // Split the IV and encrypted data
  const parts = encryptedData.split(':ai');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');

  // Create decipher using the key and IV
  const decipher = crypto.createDecipheriv('aes-256-cbc', validKey, iv);

  // Decrypt the data
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf-8');
}

const createResetToken = async () => {
  const resetToken = crypto.randomBytes(20).toString('hex'); // Generate a random token
  const hashedResetToken = encrypt(resetToken);
  return { resetToken, hashedResetToken };
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

const validateToken = async (tokenCreatedTimestamp, duration) => {
  //Parse the token creation timestamp
  const tokenCreatedAt = moment(tokenCreatedTimestamp);
  //Get the current timestamp using Moment.js
  const currentTimestamp = moment();
  // Calculate the difference between the current timestamp and the token creation timestamp
  const timeDifference = moment.duration(currentTimestamp.diff(tokenCreatedAt));
  // Check if the difference is within the allowed time window
  const isTokenValid = timeDifference.asMinutes() <= Number(duration);
  return isTokenValid ? true : false;
}

const validateRole = (role) => {
  const valid = role === "user" || role === "admin" || role === "superadmin" || role === "poweradmin" ? true : false;
  return valid;
}

const validateUserCategory = (role) => {
  const valid = role === "Staff" || role === "Student" || role === "Indivudual" || role === "Organization" ? true : false;
  return valid;
}

module.exports = {
  dateTime,
  date,
  time,
  generateToken,
  createFolderIfNotExists,
  generateUniqueRandomNumber,
  createResetToken,
  encrypt,
  decrypt,
  hashPassword,
  validateToken,
  validateRole,
  validateUserCategory
};
