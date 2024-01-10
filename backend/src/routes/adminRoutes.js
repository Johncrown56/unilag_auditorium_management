const express = require("express");
const router = express.Router();
const { userCount } = require("../controllers/adminControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, userCount);

module.exports = router;
