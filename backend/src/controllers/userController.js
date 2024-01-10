const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
// const cloudinary = require("../config/cloudinary");
const { executeQuery } = require("../config/connection");
const { dateTime, generateToken } = require("../utils/functions");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/email");
const { revokedTokens } = require("../middleware/authMiddleware");

const isEmailExist = async (email) => {
  const result = await executeQuery("SELECT * FROM users WHERE email = ? ", [
    email,
  ]);
  return result.length > 0 ? true : false;
};

const isUserExist = async (email, phone, userCategoryId) => {
  const result = await executeQuery(
    "SELECT * FROM users WHERE email = ? OR phone = ? OR userCategoryId = ?",
    [email, phone, userCategoryId]
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

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    userCategory,
    userCategoryId,
  } = req.body;
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
      res.status(400);
      throw new Error("User not found");
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
    if (await isUserIdExist(userId)) {
      const query =
        "UPDATE `users` SET `firstName` = ?, `lastName` = ?, `phone` = ?, `dateUpdated` = ? WHERE `userId` = ? ";
      const res = await executeQuery(query, [
        firstName,
        lastName,
        phone,
        dateUpdated,
        userId,
      ]);
      if (res) {
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
    } else {
      res.status(400).json({ success: false, message: "User not found" });
    }
  } catch (error) {}
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
    const result = await executeQuery("SELECT * FROM users ", []);
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

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  getAllUsers,
};
