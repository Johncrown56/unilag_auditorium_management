const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  create,
  fetch,
  fetchOne,
  update,
  checkAvailability,
} = require("../controllers/bookingControllers");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 },
}); // 30MB is the file upload limit

router.route("/").post(protect, upload.none(), create).get(protect, fetch);
router.route("/:id").get(protect, fetchOne).put(protect, update);
router.route("/check").post(protect, checkAvailability);

module.exports = router;
