const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");
const { dateTime, generateUniqueRandomNumber } = require("../utils/functions");
const moment = require("moment/moment");
const sendEmail = require("../utils/email");
const sendAdminEmail = require("../utils/adminEmail");

const userInfo = async (userId) => {
  const result = await executeQuery("SELECT * FROM users WHERE userId = ? ", [
    userId,
  ]);
  const user = result[0];
  return user;
};

const create = asyncHandler(async (req, res) => {
  const {
    audId,
    purpose,
    remarks,
    start,
    end,
    type,
    features,
    approved,
    paymentStatus,
  } = req.body;

  if (!audId || !purpose || !start || !end || !type) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const userId = req.user.userId;
  const startDate = moment(start.date).format("YYYY-MM-DD"); //new Date(start.date).toISOString().split("T")[0]; // Format the date to 'YYYY-MM-DD'
  const startTime = moment(start.time).format("HH:mm:ss");
  const endDate = moment(end.date).format("YYYY-MM-DD"); // new Date(end.date).toISOString().split("T")[0];
  const endTime = moment(end.time).format("HH:mm:ss");
  const bookingId = generateUniqueRandomNumber();
  const dateCreated = dateTime();
  const dateUpdated = dateTime();
  const values = [
    bookingId,
    audId,
    purpose,
    remarks,
    type,
    startDate,
    startTime,
    endDate,
    endTime,
    approved,
    paymentStatus,
    userId,
    dateCreated,
    dateUpdated,
  ];

  try {
    const auditorium = await executeQuery(
      "SELECT * FROM `auditoriums` WHERE audID = ? ",
      [audId]
    );

    if (auditorium.length == 0) {
      res
        .status(404)
        .json({ success: false, message: "Auditorium Id does not exist" });
    } else {
      const query =
        "INSERT INTO `bookings` ( `bookingId`, `audId`, `purpose`, `remarks`, `type`, `startDate`, `startTime`, `endDate`, `endTime`, `approved`, `paymentStatus`, `userId`, `dateCreated`, `dateUpdated`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) ";
      const save = await executeQuery(query, values);

      if (features.length > 0) {
        features.forEach(async (feature, index) => {
          const featureSql =
            "INSERT INTO `booking_features` ( `featureId`, `bookingId`) VALUES ( ?, ? )";
          await executeQuery(featureSql, [feature, bookingId]);
          return { index: index + 1, feature };
        });
      }

      const user = await userInfo(userId);

      if (save) {
        const data = {
          bookingId,
          name: auditorium[0].name,
          audId,
          purpose,
          remarks,
          type,
          startDate,
          startTime,
          endDate,
          endTime,
          approved,
          paymentStatus,
          userId,
          dateCreated,
          dateUpdated,
          features,
        };

        const props = {
          emailSubject: "Your auditorium booking is received",
          sendTo: user.email,
          sentFrom: {
            name: process.env.APP_NAME,
            address: process.env.GMAIL_APP_USERNAME,
          },
          template: "pendingbooking",
          attachIcons: false,
          attachments: [
            {
              filename: "kyc-progress.png",
              path: __dirname + "/../assets/email/kyc-progress.png",
              cid: "kyc-progress",
            },
          ],
          context: { ...req.body, ...user },
        };

        const adminProps = {
          emailSubject: "New Booking request is received",
          sendTo: process.env.ADMINEMAIL,
          sentFrom: {
            name: process.env.APP_NAME,
            address: process.env.GMAIL_APP_USERNAME,
          },
          template: "adminbookingnotification",
          attachIcons: false,
          context: req.body,
        };

        await sendAdminEmail(adminProps).then((response) => {
          // console.log(response);
        });

        await sendEmail(props)
          .then((response) => {
            res.status(200).json({
              success: true,
              message: "Auditorium booked successfully",
              additionalMessage: "Message sent to your email successfully",
              data,
              email: response,
            });
          })
          .catch((error) => {
            // When email is not sent but account is created
            res.status(200).json({
              success: true,
              data,
              message: "Auditorium booked successfully",
              additionalMessage: "There is an issue sending email to user",
              email: error,
            });
          });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Auditorium not created" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetch = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const userId = req.user.userId;
  try {
    const allBookings =
      type != undefined && type === "user"
        ? await executeQuery("SELECT * FROM `bookings` WHERE userId = ? ", [
            userId,
          ])
        : await executeQuery("SELECT * FROM `bookings` ", []);
    const promises = allBookings.map(async (bookings) => {
      const features = await executeQuery(
        "SELECT booking_features.id AS bookingFeatureId, booking_features.featureId AS featureId, booking_features.bookingId, features.name FROM booking_features JOIN features ON booking_features.featureId = features.id WHERE booking_features.bookingId = ? ",
        [bookings.bookingId]
      );

      const auditorium = await executeQuery(
        "SELECT * FROM `auditoriums` WHERE audID = ? ",
        [bookings.audId]
      );

      const category = await executeQuery(
        "SELECT name, description FROM `event_categories` WHERE id = ? ",
        [bookings.type]
      );

      return {
        ...bookings,
        category: category[0],
        name: auditorium[0].name,
        features,
      };
    });

    const result = await Promise.all(promises);
    if (result) {
      res.status(200).json({
        success: true,
        message: "Bookings fetched successfully",
        data: result,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Bookings can not be fetched" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const update = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetchOne = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;

  try {
    const allBookings = await executeQuery(
      "SELECT * FROM `bookings` WHERE bookingId = ?",
      [bookingId]
    );
    const promises = allBookings.map(async (bookings) => {
      const features = await executeQuery(
        "SELECT booking_features.id AS bookingFeatureId, booking_features.featureId AS featureId, booking_features.bookingId, features.name FROM booking_features JOIN features ON booking_features.featureId = features.id WHERE booking_features.bookingId = ? ",
        [bookings.bookingId]
      );

      const auditorium = await executeQuery(
        "SELECT * FROM `auditoriums` WHERE audID = ? ",
        [bookings.audId]
      );

      const category = await executeQuery(
        "SELECT name, description FROM `event_categories` WHERE id = ? ",
        [bookings.type]
      );

      return {
        ...bookings,
        category: category[0],
        name: auditorium[0].name,
        features,
      };
    });

    const result = await Promise.all(promises);
    if (result) {
      res.status(200).json({
        success: true,
        message: "Booking fetched successfully",
        data: result,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Booking can not be fetched" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  create,
  fetch,
  update,
  fetchOne,
};
