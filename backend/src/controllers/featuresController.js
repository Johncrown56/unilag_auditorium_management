const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");
const { dateTime } = require("../utils/functions");

const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;
  if (!name) {
    res.status(400);
    throw new Error("Please provide feature name");
  }
  const dateCreated = dateTime();
  const dateUpdated = dateTime();
  const query =
    "INSERT INTO `features`(`name`, `dateCreated`, `dateUpdated`, `userID`) VALUES (?, ?, ?, ?)";
  const save = await executeQuery(query, [
    name,
    dateCreated,
    dateUpdated,
    userId,
  ]);
  if (save) {
    const data = { name, dateCreated, dateUpdated };
    res.status(200).json({
      success: true,
      message: "Feature Created successfully",
      data: data,
    });
  } else {
    res.status(400).json({ success: false, message: "Feature not created" });
  }
});

const update = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide feature id");
  }
  if (!name) {
    res.status(400);
    throw new Error("Please provide feature name");
  }
  const check = await executeQuery("SELECT * FROM features WHERE id = ? ", [
    id,
  ]);
  if (check[0]) {
    const dateUpdated = dateTime();
    const query =
      "UPDATE `features` SET `name` = ?, `dateUpdated` = ? WHERE `id` = ? ";
    const save = await executeQuery(query, [name, dateUpdated, id]);
    if (save) {
      const data = { id, name, dateUpdated };
      res.status(200).json({
        success: true,
        message: "Feature Updated successfully",
        data: data,
      });
    } else {
      res.status(400).json({ success: false, message: "Feature not updated" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Feature Id does not exist" });
  }
});

const remove = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide feature id");
  }
  const check = await executeQuery("SELECT * FROM features WHERE id = ? ", [
    id,
  ]);
  if (check[0]) {
    const query = "DELETE FROM `features` WHERE `id` = ? ";
    const deleteFeature = await executeQuery(query, [id]);
    if (deleteFeature) {
      res.status(200).json({
        success: true,
        message: "Feature deleted successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Feature could not deleted" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Feature Id does not exist" });
  }
});

const fetch = asyncHandler(async (req, res) => {
  const check = await executeQuery("SELECT * FROM features ", []);
  if (check) {
    res.status(200).json({
      success: true,
      message: "Feature fetched successfully",
      data: check,
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Feature could not be fetched" });
  }
});

module.exports = {
  create,
  update,
  fetch,
  remove,
};
