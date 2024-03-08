const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
// const cloudinary = require("../config/cloudinary");
const { executeQuery } = require("../config/connection");
const { dateTime, generateToken, createResetToken, validateToken, hashPassword, decrypt, validateUserCategory } = require("../utils/functions");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/email");
const { revokedTokens } = require("../middleware/authMiddleware");
const { COOKIES_VALIDITY_PERIOD, ACTIVITY_RESET_PASSWORD } = require("../utils/constants");

const isEmailExist = async (email) => {
  const result = await executeQuery("SELECT * FROM users WHERE email = ? ", [
    email,
  ]);
  return result.length > 0 ? true : false;
};

const isUserExist = async (email, phone, userCategoryId) => {
  console.log({ email })
  console.log({ phone })
  console.log({ userCategoryId })
  let query;
  let values;
  if (userCategoryId === "") {
    query = "SELECT * FROM users WHERE email = ? OR phone = ? ";
    values = [email, phone]
  } else {
    query = "SELECT * FROM users WHERE email = ? OR phone = ? OR userCategoryId = ?"
    values = [email, phone, userCategoryId]
  }
  const result = await executeQuery(
    query,
    values
  );
  return result.length > 0 ? true : false;
};

const isUserIdExist = async (userId) => {
  const result = await executeQuery("SELECT * FROM users WHERE userId = ?", [
    userId,
  ]);
  return result.length > 0 ? true : false;
};

const isPhoneExist = async (phone) => {
  const result = await executeQuery("SELECT * FROM users WHERE phone = ?", [
    phone,
  ]);
  return result.length > 0 ? true : false;
};

const userInfo = async (userId) => {
  const result = await executeQuery("SELECT * FROM users WHERE userId = ? ", [
    userId,
  ]);
  return result[0];
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("reach reg", req.body);
  const {
    firstName,
    lastName,
    email,
    role,
    phone,
    password = req.user.role.includes("admin") ? uuidv4() : '',
    userCategory,
    userCategoryId = "",
  } = req.body;
  console.log(firstName,
    lastName,
    email,
    phone,
    userCategory,
    password,
    role)
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !userCategory ||
    !password ||
    !role
  ) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  if (!validateUserCategory(userCategory)) {
    res.status(400);
    throw new Error("User Category not valid");
  }

  if (role === "admin" && userCategory !== "Staff") {
    res.status(400);
    throw new Error(`User can not be assigned ${role} role`);
  }

  try {
    // check if the user exists
    if (await isEmailExist(email)) {
      res.status(400);
      throw new Error("Email already exists");
    }

    // check if the user exists
    if (await isUserExist(email, phone, userCategoryId)) {
      res.status(400);
      throw new Error("User already exists");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = uuidv4();
    const dateCreated = dateTime();
    const dateUpdated = dateTime();

    const query =
      "INSERT INTO `users` ( `userId`, `firstName`, `lastName`, `email`, `phone`, `password`, `role`, `userCategory`, `userCategoryId`, `dateCreated`, `dateUpdated`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
    const user = await executeQuery(query, [
      userId,
      firstName,
      lastName,
      email,
      phone,
      hashedPassword,
      role,
      userCategory,
      userCategoryId,
      dateCreated,
      dateUpdated,
    ]);
    if (user) {
      const fetch = "SELECT * FROM users WHERE email = ? ";
      const data = await executeQuery(fetch, [email]);
      const user = (({ password, dateCreated, dateUpdated, ...rest }) => rest)(
        data[0]
      );
      const token = generateToken(res, userId);
      // const {
      //   id,
      //   userId,
      //   firstName,
      //   lastName,
      //   email,
      //   phone,
      //   role,
      //   userCategory,
      //   userCategoryId,
      // } = data[0];
      const profile = { ...user, token };
      const props = {
        emailSubject: "Welcome to U-IAMS",
        sendTo: email,
        sentFrom: {
          name: process.env.APP_NAME,
          address: process.env.GMAIL_APP_USERNAME,
        },
        template: "welcomeemail",
        attachIcons: true,
        context: req.body,
      };

      await sendEmail(props)
        .then((response) => {
          res.status(200).json({
            success: true,
            message: "User registered successfully",
            additionalMessage: "Message sent to your email successfully",
            data: profile,
            email: response,
          });
        })
        .catch((error) => {
          // When email is not sent but account is created
          res.status(200).json({
            success: true,
            data: profile,
            message: "User registered successfully",
            additionalMessage: "There is an issue sending email to user",
            email: error,
          });
        });
    } else {
      res.status(400);
      throw new Error("User can not be created. Please try again");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  try {
    //check if user exists
    if (await isEmailExist(email)) {
      const result = await executeQuery(
        "SELECT * FROM users WHERE email = ? ",
        [email]
      );
      const user = result[0];
      // check password and validate it
      const comparePassword = await bcrypt.compare(password, user.password);
      if (user && comparePassword) {
        const data = (({ password, dateCreated, dateUpdated, ...rest }) =>
          rest)(user);
        const token = generateToken(res, user.userId);
        const profile = { ...data, token };
        res.status(200).json({
          success: true,
          message: "User login successfully",
          data: profile,
        });
      } else {
        res.status(400).json({ success: false, message: "Invalid Password" });
      }
    } else {
      res.status(400).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(400);
    throw new Error("Please provide User id");
  }
  if (await isUserIdExist(userId)) {
    try {
      const result = await executeQuery(
        "SELECT * FROM users WHERE userId = ?",
        [userId]
      );
      // Exclude the 'password' field from each user
      const sanitizedUsers = result.map((user) => {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
      });

      if (result) {
        res.status(200).json({
          success: true,
          message: "User fetched successfully",
          data: sanitizedUsers,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "User can not be fetched" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ success: false, message: "User not found" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  const userId = req.params.id;
  const dateUpdated = dateTime();

  try {
    const userIdExist = await isUserIdExist(userId);
    if (!userIdExist) {
      res.status(400)
      throw new Error("User not found");
    }
    const query =
      "UPDATE `users` SET `firstName` = ?, `lastName` = ?, `phone` = ?, `dateUpdated` = ? WHERE `userId` = ? ";
    const resp = await executeQuery(query, [
      firstName,
      lastName,
      phone,
      dateUpdated,
      userId,
    ]);
    if (resp) {
      const result = await executeQuery(
        "SELECT * FROM users WHERE userId = ?",
        [userId]
      );
      // Exclude the 'password' field from user row
      const sanitizedUsers = result.map((user) => {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
      });
      if (result) {
        res.status(200).json({
          success: true,
          message: "User saved successfully",
          data: sanitizedUsers,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "User saved but can not be fetched",
        });
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const addToken = revokedTokens.push(req.token);
  if (addToken) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(204).json({
      success: true,
      message: "User logout successfully",
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "User could not be logged out" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const result = await executeQuery("SELECT * FROM users ORDER BY id DESC", []);
    // Exclude the 'password' field from each user
    const sanitizedUsers = result.map((user) => {
      const { password, ...sanitizedUser } = user;
      return sanitizedUser;
    });

    if (result) {
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: sanitizedUsers,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Users can not be fetched" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Please provide your email");
  }
  if (await isEmailExist(email) === false) {
    res.status(400);
    throw new Error("Email not found")
  }

  const token = await createResetToken();
  const { resetToken, hashedResetToken } = token;
  const type = "RESET_PASSWORD";

  // insert into table
  const query = "INSERT INTO `password-token` ( `email`, `token`, `type`) VALUES (?, ?, ?)";
  const sql = await executeQuery(query, [email, hashedResetToken, type]);
  // fetch user details
  const fetch = "SELECT `firstName`, `lastName` FROM users WHERE email = ? ";
  const data = await executeQuery(fetch, [email]);
  const user = data[0];
  const url = `${process.env.FE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  // send email notification to user
  if (sql) {

    const props = {
      emailSubject: "Reset Password Request",
      sendTo: email,
      sentFrom: {
        name: process.env.APP_NAME,
        address: process.env.GMAIL_APP_USERNAME,
      },
      template: "passwordrequest",
      attachIcons: false,
      context: { ...req.body, user, url },
    };

    await sendEmail(props)
      .then((response) => {
        res.status(200).json({
          success: true,
          message: "Password request sent to your email successfully",
          additionalMessage: "Message sent to your email successfully",
          data: { email },
          email: response,
        });
      })
      .catch((error) => {
        // When email is not sent but account is created
        res.status(200).json({
          success: true,
          data: { email },
          message: "Password request treated successfully",
          additionalMessage: "There is an issue sending email to user",
          email: error,
        });
      });
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token, email } = req.body;
  if (!email || !password || !token) {
    res.status(400);
    throw new Error("Please provide your email, password and token");
  }

  const type = "RESET_PASSWORD";
  // find the token if it exists on the database
  const query = "SELECT `token`, `createdAt` FROM `password-token` WHERE email = ? AND `type` = ? ORDER BY id DESC ";
  const data = await executeQuery(query, [email, type]);
  const findPassword = data[0];
  // if the token is not found, notify the user
  if (!findPassword) {
    res.status(400);
    throw new Error(`Invalid Reset Password Request`);
  }

  if (findPassword.token === '') {
    res.status(400);
    throw new Error(`Token used or invalid`);
  }

  const decryptedToken = decrypt(findPassword.token);

  if (decryptedToken !== token) {
    res.status(400);
    throw new Error(`Invalid token`);
  }

  // check email
  const user = await isEmailExist(email);
  if (!user) {
    res.status(400);
    throw new Error(`User not found`);
  }

  try {
    // check if the token is still valid within the duration set on the .env file
    const validatedToken = await validateToken(findPassword.createdAt, COOKIES_VALIDITY_PERIOD);
    console.log(validatedToken)
    if (!validatedToken) {
      res.status(400);
      throw new Error('Reset token is not valid or has expired.')
    }

    const newHashedPassword = await hashPassword(password);
    const query = "UPDATE `password-token` SET `token` = ? WHERE `email` = ? AND `type` = ? ORDER BY `id` DESC";
    const data = await executeQuery(query, ["", email, type]);
    const responseData = data[0];
    // Update the password field and save the changes to the database

    const query2 = "UPDATE `users` SET password = ? WHERE email = ?";
    const data2 = await executeQuery(query2, [newHashedPassword, email]);
    const responseData2 = data2[0];

    // fetch user details
    const query3 = "SELECT `firstName`, `lastName`, `userId` FROM users WHERE email = ? ";
    const data3 = await executeQuery(query3, [email]);
    const user = data3[0];

    // save the user activity
    const query4 = "INSERT INTO `user-activity` (`userId`, `activity`) VALUES ( ?, ?)";
    const data4 = await executeQuery(query4, [user.userId, ACTIVITY_RESET_PASSWORD]);
    const responseData4 = data4[0];

    // send email notification
    const props = {
      emailSubject: "Password reset Successful",
      sendTo: email,
      sentFrom: {
        name: process.env.APP_NAME,
        address: process.env.GMAIL_APP_USERNAME,
      },
      template: "passwordrequestsuccess",
      attachIcons: false,
      context: { ...req.body, user },
    };

    await sendEmail(props)
      .then((response) => {
        res.status(200).json({
          success: true,
          message: "Password reset successfully",
          additionalMessage: "Message sent to your email successfully",
          data: { email },
          email: response,
        });
      })
      .catch((error) => {
        // When email is not sent but account is created
        res.status(200).json({
          success: true,
          data: { email },
          message: "Password reset successfully",
          additionalMessage: "There is an issue sending email to user",
          email: error,
        });
      });

  } catch (error) {
    console.log(error);
    res.status(500)
    throw new Error(`Internal Server Error`);
  }


})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;
  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide your old Password and new Password");
  }

  // check if old password is correct by decrypting it
  const user = await userInfo(userId);
  const comparePassword = await bcrypt.compare(oldPassword, user.password);
  if (!comparePassword) {
    res.status(403);
    throw new Error(`Old Password not correct`);
  }

  try {
    // Update the password field and save the changes to the database
    const newHashedPassword = await hashPassword(newPassword);
    const query2 = "UPDATE `users` SET password = ? WHERE userId = ?";
    await executeQuery(query2, [newHashedPassword, userId]);
    const data = (({ password, dateCreated, dateUpdated, ...rest }) =>
      rest)(user);
    const token = generateToken(res, user.userId);
    const profile = { ...data, token };
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: profile,
    });

  } catch (error) {
    console.log(error);
    res.status(500)
    throw new Error(`Internal Server Error`);
  }
})

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  changePassword
};
