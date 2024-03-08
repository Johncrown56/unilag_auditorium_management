const asyncHandler = require("express-async-handler");
const { dateTime } = require("../utils/functions");
const { executeQuery } = require("../config/connection");

const createEventCategories = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please provide name of the category");
  }

  const dateCreated = dateTime();
  const dateUpdated = dateTime();
  const values = [
    name,
    description != undefined ? description : "",
    dateCreated,
    dateUpdated,
  ];

  try {
    const check = await executeQuery(
      "SELECT * FROM event_categories WHERE name = ? ",
      [name]
    );
    if (check > 0) {
      res
        .status(400)
        .json({ success: false, message: "Event Category already exists" });
    }

    const query =
      "INSERT INTO `event_categories` (`name`, `description`, `dateCreated`, `dateUpdated`) VALUES (?, ?, ?, ?) ";
    const result = await executeQuery(query, values);
    if (result) {
      const data = {
        name,
        description,
        dateCreated,
        dateUpdated,
      };
      res.status(200).json({
        success: true,
        message: "Event category saved successfully",
        data,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Event Category not saved" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetchEventCategories = asyncHandler(async (req, res) => {
  try {
    const check = await executeQuery("SELECT * FROM event_categories ORDER BY id DESC", []);
    if (check) {
      res.status(200).json({
        success: true,
        message: "Event Categories fetched successfully",
        data: check,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Event Categgories  could not be fetched",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateEventCategories = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide category id");
  }
  if (!name) {
    res.status(400);
    throw new Error("Please provide category name");
  }

  try {
    const check = await executeQuery(
      "SELECT * FROM event_categories WHERE id = ? ",
      [id]
    );
    if (check.length > 0) {
      const dateUpdated = dateTime();
      const query =
        "UPDATE `event_categories` SET `name` = ?, `description`= ?, `dateUpdated` = ? WHERE `id` = ? ";
      const save = await executeQuery(query, [
        name,
        description,
        dateUpdated,
        id,
      ]);
      if (save) {
        const data = { id, name, description, dateUpdated };
        res.status(200).json({
          success: true,
          message: "Event category updated successfully",
          data: data,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Event category not updated" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Event category Id does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const removeEventCategories = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide Event category id");
  }

  try {
    const check = await executeQuery(
      "SELECT * FROM event_categories WHERE id = ? ",
      [id]
    );
    if (check.length > 0) {
      const query = "DELETE FROM `event_categories` WHERE `id` = ? ";
      const deleteFeature = await executeQuery(query, [id]);
      if (deleteFeature) {
        res.status(200).json({
          success: true,
          message: "Event category deleted successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Event category could not deleted",
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Event category Id does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  createEventCategories,
  fetchEventCategories,
  updateEventCategories,
  removeEventCategories,
};
