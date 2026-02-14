const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validations/auth.validation");

const generateToken = (user) =>
  jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

exports.register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await User.findOne({ email: data.email });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already exists" });

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

exports.login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(data.password, user.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      token: generateToken(user)
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json({ success: true, user });
};
