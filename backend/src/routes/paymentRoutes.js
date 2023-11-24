const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  create,
  fetch,
  fetchOne,
} = require("../controllers/paymentControllers");

router.route("/").post(protect, create).get(protect, fetch);
router.route("/:id").get(protect, fetchOne);

module.exports = router;
