const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  getAllUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/logout", protect, logoutUser);
router.route("/profile/:id").get(protect, getUser).put(protect, updateUser);
router.route("/all").get(protect, getAllUsers);

module.exports = router;
