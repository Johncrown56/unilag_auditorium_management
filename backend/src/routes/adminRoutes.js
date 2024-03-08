const express = require("express");
const router = express.Router();
const { userCount, update, fetch, remove } = require("../controllers/adminControllers");
const { adminProtect, superadminProtect } = require("../middleware/authMiddleware");
const { registerUser } = require("../controllers/userController");

router.route("/").get(adminProtect, fetch).post(adminProtect, registerUser)
router.route("/count").get(adminProtect, userCount)
router.route("/:id").put(adminProtect, update).delete(superadminProtect, remove);

module.exports = router;
