const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const {
  registerSchema,
  loginSchema
} = require("../validations/auth.validation");


// ✅ TOKEN GENERATOR WITH REMEMBER ME
const generateToken = (user, rememberMe = false) =>
  jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberMe ? "30d" : "1d"
    }
  );


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await User.findOne({ email: data.email });

    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashed
    });

    res.status(201).json({
      success: true,
      token: generateToken(user)
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(data.password, user.password);

    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user, data.rememberMe);

    res.json({
      success: true,
      token
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ================= ME =================
exports.me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  res.json({
    success: true,
    user
  });
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;


  // 📧 EMAIL TRANSPORT
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    html: `
      <h3>Password Reset</h3>
      <p>Click below to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
    `
  });

  res.json({
    success: true,
    message: "Reset link sent to email"
  });
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({
    success: true,
    message: "Password reset successful"
  });
};
