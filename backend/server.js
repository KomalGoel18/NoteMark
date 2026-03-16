require("dotenv").config();
const dns = require("dns");

// ✅ Fix MongoDB SRV DNS issues
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const passport = require("passport");        // ✅ IMPORT PASSPORT
require("./config/passport");                // ✅ LOAD STRATEGIES

const app = require("./app");
const connectDB = require("./config/db");

// ✅ Passport middleware
app.use(passport.initialize());

// ✅ Health route for cron ping
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server running",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();