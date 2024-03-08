const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", protect, logoutUser);
router.route("/profile/:id").get(protect, getUser).put(protect, updateUser);
router.route("/all").get(protect, getAllUsers);
router.route("/change-password").put(protect, changePassword);


module.exports = router;
