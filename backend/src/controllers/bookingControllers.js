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
    "Pending",
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
        "INSERT INTO `bookings` ( `bookingId`, `audId`, `purpose`, `remarks`, `type`, `startDate`, `startTime`, `endDate`, `endTime`, `status`, `approved`, `paymentStatus`, `userId`, `dateCreated`, `dateUpdated`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) ";
      const save = await executeQuery(query, values);

      const sql =
        "INSERT INTO `payment` (`amount`, `transactionID`, `status`, `platform`, `bookingID`, `userID`, `remarks`, `dateCreated`) VALUES (?,?,?,?,?,?,?,?)";
      const savePayment = await executeQuery(sql, [
        totalAmount,
        transactionId,
        paymentStatus,
        paymentPlatform,
        bookingId,
        userId,
        paymentRemarks || "",
        dateCreated,
      ]);

      const sql2 =
        "INSERT INTO `payment_breakdown`(`transactionID`, `cautionFee`, `cleaningCharges`, `vat`, `eventDays`) VALUES (?,?,?,?,?)";
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

        const message = `We are pleased to notify you that your auditorium booking with id ${bookingId} is under review. We will send a confirmation email once your booking is approved.`;
        const title = `Your Booking Is Under Review`;
        const adminMessage = `A new booking request has been made. Kindly approve or disapprove on the admin portal`;
        const adminTitle = `New Booking Alert`;
        const colour = "#6576ff";
        const cid = "cid:kyc-progress";
        const props = {
          emailSubject: "Your auditorium booking is received",
          sendTo: user.email,
          sentFrom: {
            name: process.env.APP_NAME,
            address: process.env.GMAIL_APP_USERNAME,
          },
          template: "booking",
          attachIcons: false,
          attachments: [
            {
              filename: "kyc-progress.png",
              path: __dirname + "/../assets/email/kyc-progress.png",
              cid: "kyc-progress",
            },
          ],
          context: { ...req.body, ...user, message, title, colour, cid },
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
          context: {...req.body, adminMessage, adminTitle},
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
  const userId = req.user.userId;
  const role = req.user.role;
  try {
    const allBookings =
      role === "admin"
        ? await executeQuery("SELECT * FROM `bookings` ", [])
        : await executeQuery("SELECT * FROM `bookings` WHERE userId = ? ", [
            userId,
          ]);
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

    const values = [purpose, remarks, type, status, dateUpdated, bookingId];

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
        res.status(400).json({
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

const changeStatus = asyncHandler(async (req, res) => {
  const {user } = req;
  const {role} = user;
  const bookingId = req.params.id;
  const { status } = req.body;
  if (role === "admin") {
    try {
      const bookings = await executeQuery(
        "SELECT * FROM `bookings` WHERE bookingId = ? ",
        [bookingId]
      );
      const dateUpdated = dateTime();
      const values = [status, dateUpdated, bookingId];
      if (bookings.length > 0) {
        const query =
          "UPDATE `bookings` SET `status` = ?, `dateUpdated` = ? WHERE `bookingId` = ?";
        const update = await executeQuery(query, values);
        const result = await executeQuery(
          "SELECT * FROM `bookings` WHERE bookingId = ?",
          [bookingId]
        );
       const data = result;        
        if (update) {
          // res.status(200).json({
          //   success: true,
          //   message: `Booking ${status.toLowerCase()} successfully`,
          //   data: result,
          // });
          const message = `We are pleased to notify you that your auditorium booking with ID #${bookingId} is ${status.toLowerCase()}. Kindly go to you portal to view accordingly.`;
          const title = `Your Booking ID #${bookingId} is ${status}`;
          const adminMessage = `You ${status.toLowerCase()} a booking ID #${bookingId}. Kindly change the status of the booking if it's done in error.`;
          const adminTitle = `Booking ID #${bookingId} ${status} by You`;
          const colour = status === "Approved" ? "#1ee0ac": status === "Cancelled" ? "#f4bd0e": "#6576ff";
          const cid = status === "Approved" ? "cid:kyc-success": status === "Cancelled" ? "cid:kyc-pending": "cid:kyc-progress";
          const props = {
            emailSubject: `Your Auditorium booking is ${status}`,
            sendTo: user.email,
            sentFrom: {
              name: process.env.APP_NAME,
              address: process.env.GMAIL_APP_USERNAME,
            },
            template: "booking",
            attachIcons: false,
            attachments: [
              {
                filename: status === "Approved" ? "kyc-success.png": status === "Cancelled" ? "kyc-pending.png": "kyc-progress.png",
                path: status === "Approved" ? __dirname + "/../assets/email/kyc-success.png" : status === "Cancelled" ? __dirname + "/../assets/email/kyc-pending.png" : __dirname + "/../assets/email/kyc-progress.png",
                cid: status === "Approved" ? "kyc-success": status === "Cancelled" ? "kyc-pending": "kyc-progress",
              },
            ],
            context: { ...req.body, ...user, message, title, colour, cid },
          };
  
          const adminProps = {
            emailSubject: `You ${status} booking ID #${bookingId}`,
            sendTo: process.env.ADMINEMAIL,
            sentFrom: {
              name: process.env.APP_NAME,
              address: process.env.GMAIL_APP_USERNAME,
            },
            template: "adminbookingnotification",
            attachIcons: false,
            context: {...req.body, adminMessage, adminTitle},
          };
  
          await sendAdminEmail(adminProps).then((response) => {
            // console.log(response);
          });
  
          await sendEmail(props)
            .then((response) => {
              res.status(200).json({
                success: true,
                message: `Booking ${status.toLowerCase()} successfully`,
                additionalMessage: "Message sent to your email successfully",
                data,
                email: response,
              });
            })
            .catch((error) => {
              // When email is not sent but status is changed
              res.status(200).json({
                success: true,
                data,
                message: `Booking ${status.toLowerCase()} successfully`,
                additionalMessage: "There is an issue sending email to user",
                email: error,
              });
            });

        } else {
          res.status(400).json({
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
  } else {
    throw new Error("You don't have permission to update status");
  }
});

module.exports = {
  create,
  fetch,
  update,
  fetchOne,
  checkAvailability,
  changeStatus,
};
