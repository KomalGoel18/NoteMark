const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  toggleFavorite
} = require("../controllers/bookmarks.controller");

router.use(auth);

router.post("/", createBookmark);
router.get("/", getBookmarks);
router.get("/:id", getBookmarkById);
router.put("/:id", updateBookmark);
router.delete("/:id", deleteBookmark);
router.patch("/:id/favorite", toggleFavorite);

module.exports = router;
