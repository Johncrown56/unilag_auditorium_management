const express = require("express");
const router = express.Router();
const {
  create,
  update,
  remove,
  fetch,
  fetchImages,
  fetchOne,
} = require("../controllers/auditoriumControllers");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 },
}); // 30MB is the file upload limit

router.route("/").post(protect, upload.none(), create).get(fetch);
router.route("/:id").get(fetchOne).put(protect, update).delete(protect, remove);
router.route("/get-images").get(fetchImages);

module.exports = router;
