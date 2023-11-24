const express = require("express");
const router = express.Router();
const {
  create,
  update,
  remove,
  fetch,
} = require("../controllers/featuresController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, create).get(protect, fetch);
router.route("/:id").put(protect, update).delete(protect, remove);

module.exports = router;
