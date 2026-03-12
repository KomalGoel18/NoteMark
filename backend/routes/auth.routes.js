const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

/* ================= NORMAL AUTH ================= */

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

/* ================= PASSWORD RESET ================= */

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/* ================= GOOGLE ================= */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${req.user.token}`
    );
  }
);

/* ================= GITHUB ================= */

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${req.user.token}`
    );
  }
);

module.exports = router;