require("dotenv").config();
const dns = require("dns");

// Fix for MongoDB Atlas SRV resolution issues in some environments/ISPs
// Forces Node to use public DNS servers instead of the potentially broken system local resolver
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = require("./app");
const connectDB = require("./config/db");

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
