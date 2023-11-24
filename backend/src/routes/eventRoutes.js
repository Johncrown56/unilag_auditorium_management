const express = require("express");
const {
  createEventCategories,
  fetchEventCategories,
  updateEventCategories,
  removeEventCategories,
} = require("../controllers/eventControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Define API routes
router
  .route("/")
  .post(protect, createEventCategories)
  .get(protect, fetchEventCategories);
router
  .route("/:id")
  .put(protect, updateEventCategories)
  .delete(protect, removeEventCategories);

module.exports = router;
