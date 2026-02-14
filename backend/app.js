const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/notes", require("./routes/notes.routes"));

app.use("/api/bookmarks", require("./routes/bookmarks.routes"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;
