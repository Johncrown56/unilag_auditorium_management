const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");
const { dateTime } = require("../utils/functions");

const validateId = async (id) => {
  const check = await executeQuery("SELECT * FROM features WHERE id = ? ", [
    id,
  ]);
  return check.length > 0 ? true : false;
}

const validateDuplicate = async (name) => {
  const check = await executeQuery("SELECT * FROM features WHERE name = ? ", [
    name,
  ]);
  return check.length === 0 ? true : false;
}

const create = asyncHandler(async (req, res) => {
  const { name, description, amount } = req.body;
  const userId = req.user.userId;
  // validate if 
  if (!name || !description || !amount) {
    res.status(400);
    throw new Error("Please provide feature name and description");
  }
  const dateCreated = dateTime();
  const dateUpdated = dateTime();
  const check = await validateDuplicate(name);
  if (!check) {
    res.status(400);
    throw new Error("Feature already exist");
  }
  const query =
    "INSERT INTO `features`(`name`, `amount`, `description`, `dateCreated`, `dateUpdated`, `userID`) VALUES (?, ?, ?, ?, ?, ?)";
  const save = await executeQuery(query, [
    name,
    amount,
    description,
    dateCreated,
    dateUpdated,
    userId,
  ]);
  if (save) {
    const data = { name, amount, description, dateCreated, dateUpdated };
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
  const { name, description, amount } = req.body;
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide feature id");
  }
  if (!name) {
    res.status(400);
    throw new Error("Please provide feature name");
  }
  const check = await validateId(id);
  if (check) {
    const dateUpdated = dateTime();
    const query =
      "UPDATE `features` SET `name` = ?, `amount` = ?, `description` = ?, `dateUpdated` = ? WHERE `id` = ? ";
    const save = await executeQuery(query, [name, amount, description, dateUpdated, id]);
    if (save) {
      const data = { id, name, amount, description, dateUpdated };
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
  const check = await validateId(id);
  if (!check) {
    res
      .status(400)
    throw new Error("Feature Id does not exist");
  }

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

});

const fetch = asyncHandler(async (req, res) => {
  const check = await executeQuery("SELECT * FROM features ORDER BY id DESC", []);
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
