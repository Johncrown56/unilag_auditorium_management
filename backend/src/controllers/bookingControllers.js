const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");
const { dateTime, generateUniqueRandomNumber } = require("../utils/functions");
const moment = require("moment/moment");
const sendEmail = require("../utils/email");
const sendAdminEmail = require("../utils/adminEmail");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

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
    paymentPlatform,
    receipt,
    paymentStatus,
    payment,
    paymentRemarks,
  } = req.body;

  if (
    !audId ||
    !purpose ||
    !start ||
    !end ||
    !type ||
    !receipt ||
    !payment ||
    !paymentPlatform
  ) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const { totalAmount, cautionFee, cleaningCharges, vat, eventDays } = payment;

  if (!totalAmount || !cautionFee || !cleaningCharges || !vat || !eventDays) {
    res.status(400);
    throw new Error("Please provide all payment fields");
  }

  const userId = req.user.userId;
  const startDate = moment(start.date).format("YYYY-MM-DD"); //new Date(start.date).toISOString().split("T")[0]; // Format the date to 'YYYY-MM-DD'
  const startTime = moment(start.time).format("HH:mm:ss");
  const endDate = moment(end.date).format("YYYY-MM-DD"); // new Date(end.date).toISOString().split("T")[0];
  const endTime = moment(end.time).format("HH:mm:ss");
  const bookingId = generateUniqueRandomNumber();
  const transactionId = generateUniqueRandomNumber();
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

  if (!Array.isArray(receipt) && receipt.length > 0) {
    res.status(400).json({ success: false, message: "Receipt not uploaded" });
  }

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

      const sql =
        "INSERT INTO `payment` (`Amount`, `TransactionID`, `Status`, `BookingID`, `UserID`, `Remarks`, `DateCreated`) VALUES (?,?,?,?,?,?,?)";
      const savePayment = await executeQuery(sql, [
        totalAmount,
        transactionId,
        paymentStatus,
        bookingId,
        userId,
        paymentRemarks || "",
        dateCreated,
      ]);

      const sql2 =
        "INSERT INTO `payment_breakdown`(`TransactionID`, `cautionFee`, `cleaningCharges`, `vat`, `eventDays`) VALUES (?,?,?,?,?)";
      const savePaymentBreakdown = await executeQuery(sql2, [
        transactionId,
        cautionFee,
        cleaningCharges,
        vat,
        eventDays,
      ]);

      if (features.length > 0) {
        features.forEach(async (feature, index) => {
          const featureSql =
            "INSERT INTO `booking_features` ( `featureId`, `bookingId`) VALUES ( ?, ? )";
          await executeQuery(featureSql, [feature, bookingId]);
          return { index: index + 1, feature };
        });
      }

      // if (receipt.length > 0) {
      const uploadsDir = path.join(__dirname, "../../uploads");
      //const uploadsDir2 = path.join(__dirname, "../", "../", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const base64Images = receipt.map((image, index) => {
        return {
          name: `${Math.floor(Date.now() / 1000) + 60 * 60}_${index + 1}.png`, // Use a dynamic name or the original name
          type: image.type,
          data: image.data,
        };
      });

      base64Images.forEach(async (image, index) => {
        const fileName = image.name;
        const imagePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(imagePath, Buffer.from(image.data, "base64"));
        const sql =
          "INSERT INTO `receipts` (`fileName`, `transactionId`, `bookingId`, `dateCreated`, `dateUpdated`) VALUES ( ?, ?, ?, ?, ? ) ";
        await executeQuery(sql, [
          fileName,
          transactionId,
          bookingId,
          dateCreated,
          dateUpdated,
        ]);
        return { index: index + 1, fileName: fileName };
      });
      // }

      const user = await userInfo(userId);

      if (save && savePayment && savePaymentBreakdown) {
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
          base64Images,
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
    logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
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
        "SELECT `name` FROM `auditoriums` WHERE audID = ? ",
        [bookings.audId]
      );

      const images = await executeQuery(
        "SELECT * FROM `auditorium_images` WHERE audID = ? ",
        [bookings.audId]
      );

      const receipts = await executeQuery(
        "SELECT * FROM `receipts` WHERE bookingId = ? ",
        [bookings.bookingId]
      );

      const category = await executeQuery(
        "SELECT name, description FROM `event_categories` WHERE id = ? ",
        [bookings.type]
      );

      const profile = await executeQuery(
        "SELECT * FROM `users` WHERE userId = ? ",
        [bookings.userId]
      );

      const user = (({
        password,
        id,
        dateCreated,
        userId,
        dateUpdated,
        ...rest
      }) => rest)(profile[0]);

      return {
        ...bookings,
        category: category[0],
        name: auditorium[0].name,
        images,
        receipts,
        features,
        user,
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
    logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const update = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const bookingId = req.params.id;
  const { purpose, remarks, type, features, status, paymentRemarks } = req.body;
  try {
    const bookings = await executeQuery(
      "SELECT * FROM `bookings` WHERE bookingId = ?",
      [bookingId]
    );

    const dateUpdated = dateTime();

    const values = [purpose, remarks, type, status, dateUpdated];

    if (bookings.length > 0) {
      const query =
        "UPDATE `bookings` SET  `purpose` = ?, `remarks` = ?, `type` = ?, `status` = ?, `dateUpdated` = ? WHERE `bookingId` = ?";
      const update = await executeQuery(query, values);
      const result = await executeQuery(
        "SELECT * FROM `bookings` WHERE bookingId = ?",
        [bookingId]
      );
      if (update) {
        res.status(200).json({
          success: true,
          message: "Booking fetched successfully",
          data: result,
        });
      } else {
        res
          .status(400)
          .json({
            success: false,
            message: "Error: Booking can not be updated",
          });
      }
    } else {
      res.status(404).json({ error: "Booking ID does not exist" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
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

    if (allBookings.length > 0) {
      const promises = allBookings.map(async (bookings) => {
        const features = await executeQuery(
          "SELECT booking_features.id AS bookingFeatureId, booking_features.featureId AS featureId, booking_features.bookingId, features.name FROM booking_features JOIN features ON booking_features.featureId = features.id WHERE booking_features.bookingId = ? ",
          [bookings.bookingId]
        );

        const auditorium = await executeQuery(
          "SELECT * FROM `auditoriums` WHERE audID = ? ",
          [bookings.audId]
        );

        const images = await executeQuery(
          "SELECT * FROM `auditorium_images` WHERE audID = ? ",
          [bookings.audId]
        );

        const receipts = await executeQuery(
          "SELECT * FROM `receipts` WHERE bookingId = ? ",
          [bookings.bookingId]
        );

        const category = await executeQuery(
          "SELECT name, description FROM `event_categories` WHERE id = ? ",
          [bookings.type]
        );

        const profile = await executeQuery(
          "SELECT * FROM `users` WHERE userId = ? ",
          [bookings.userId]
        );

        const user = (({
          password,
          id,
          dateCreated,
          userId,
          dateUpdated,
          ...rest
        }) => rest)(profile[0]);

        return {
          ...bookings,
          category: category[0],
          name: auditorium[0].name,
          images,
          receipts,
          features,
          user,
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
    } else {
      res.status(404).json({ error: "Booking ID does not exist" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const checkAvailability = asyncHandler(async (req, res) => {
  const { audId, start, end } = req.body;

  if (!audId || !start || !end) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  if (start.date === null) {
    res.status(400).json({ success: false, message: "Start date is null" });
  }

  if (end.date === null) {
    res.status(400).json({ success: false, message: "End date is null" });
  }

  const startDate = moment(start.date).format("YYYY-MM-DD");
  const endDate = moment(end.date).format("YYYY-MM-DD");

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
      const query = `SELECT * FROM bookings WHERE audId = ? AND  ( 
          ( ? = startDate) OR ( ? = endDate) OR (? = endDate) OR ( ? = startDate)
          OR ( ? BETWEEN startDate AND endDate) OR ( ? BETWEEN startDate AND endDate))`;
      const check = await executeQuery(query, [
        audId,
        startDate,
        endDate,
        endDate,
        startDate,
        startDate,
        endDate,
      ]);

      if (check.length == 0) {
        res.status(200).json({
          success: true,
          data: { available: true, audId, start, end },
          message: "Date available for booking",
        });
      } else {
        res.status(400).json({
          success: true,
          data: { available: false },
          message: "Date already booked for event",
        });
      }
    }
  } catch (error) {
    console.log(error);
    logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
  }
});

const process = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const bookingId = req.params.id;
  const { status } = req.body;
  try {
    const bookings = await executeQuery(
      "SELECT * FROM `bookings` WHERE bookingId = ?",
      [bookingId]
    );

    const dateUpdated = dateTime();

    const values = [status, dateUpdated];

    if (bookings.length > 0) {
      const query =
        "UPDATE `bookings` SET `status` = ?, `dateUpdated` = ? WHERE `bookingId` = ?";
      const update = await executeQuery(query, values);
      const result = await executeQuery(
        "SELECT * FROM `bookings` WHERE bookingId = ?",
        [bookingId]
      );
      if (update) {
        res.status(200).json({
          success: true,
          message: "Booking fetched successfully",
          data: result,
        });
      } else {
        res
          .status(400)
          .json({
            success: false,
            message: "Error: Booking can not be updated",
          });
      }
    } else {
      res.status(404).json({ error: "Booking ID does not exist" });
    }
  } catch (error) {
    console.log(error);
    logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  create,
  fetch,
  update,
  fetchOne,
  checkAvailability,
};
