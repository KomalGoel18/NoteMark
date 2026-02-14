const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  toggleFavorite
} = require("../controllers/notes.controller");

router.use(auth);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/favorite", toggleFavorite);

module.exports = router;
