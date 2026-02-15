const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me,
  forgotPassword,
  resetPassword
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, me);

// 🔐 PASSWORD RESET
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
