const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  create,
  fetch,
  fetchOne,
  update,
} = require("../controllers/bookingControllers");

router.route("/").post(protect, create).get(protect, fetch);
router.route("/:id").get(protect, fetchOne).put(protect, update);

module.exports = router;
