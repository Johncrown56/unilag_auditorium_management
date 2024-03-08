const expressAsyncHandler = require("express-async-handler");
const { dateTime } = require("../utils/functions");
const { executeQuery } = require("../config/connection");

const create = expressAsyncHandler(async (req, res) => {
  const { Amount, TransactionID, Status, BookingID, Remarks } = req.body;
  if (!Amount || !TransactionID || !Status || !BookingID || !Remarks) {
    res.status(400);
    throw new Error("Please provide all compulsory fields");
  }

  const userId = req.user.userId;
  const dateCreated = dateTime();
  try {
    const query =
      "INSERT INTO `payment` (`amount`, `transactionID`, `status`, `platform`, `bookingID`, `userID`, `remarks`, `dateCreated`) VALUES  (?, ?, ?, ?, ?, ?, ?,?)";
    const result = await executeQuery(query, [
      Amount,
      TransactionID,
      Status,
      BookingID,
      userId,
      Remarks,
      dateCreated,
    ]);
    if (result) {
      res.status(200).json({
        success: false,
        message: "Payments created successfully",
        data: result,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payments could not be created" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const fetch = expressAsyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const role = req.user.role;
  try {
    const query = role === "admin" ? "SELECT * FROM `payment` ORDER BY paymentID DESC" : "SELECT * FROM `payment` where userID = ? ORDER BY paymentID DESC"
    const values = role === "admin" ? [] : [userId]
    const result = await executeQuery(query, values);
    if (result) {
      res.status(200).json({
        success: false,
        message: "Payments fetched successfully",
        data: result,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payments could not be fetched" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const fetchOne = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const result = await executeQuery(
      "SELECT * FROM `payment` WHERE transactionID = ? ",
      [id]
    );
    if (result) {
      res.status(200).json({
        success: false,
        message: "Payment fetched successfully",
        data: result,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment can not be fetched" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = {
  create,
  fetch,
  fetchOne,
};
