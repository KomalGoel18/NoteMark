const Bookmark = require("../models/bookmark.model");
const {
  createBookmarkSchema,
  updateBookmarkSchema
} = require("../validations/bookmark.validation");
const fetchTitle = require("../utils/fetchTitle");


// CREATE BOOKMARK
exports.createBookmark = async (req, res) => {
  try {
    const data = createBookmarkSchema.parse(req.body);

    if (!data.title) {
      data.title = await fetchTitle(data.url);
    }

    const bookmark = await Bookmark.create({
      ...data,
      user: req.user.userId
    });

    res.status(201).json({ success: true, bookmark });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// GET BOOKMARKS (SEARCH + TAG FILTER)
exports.getBookmarks = async (req, res) => {
  try {
    const { q, tags } = req.query;

    let query = { user: req.user.userId };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });

    res.json({ success: true, bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET ONE
exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!bookmark)
      return res.status(404).json({ success: false, message: "Bookmark not found" });

    res.json({ success: true, bookmark });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// UPDATE
exports.updateBookmark = async (req, res) => {
  try {
    const data = updateBookmarkSchema.parse(req.body);

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      data,
      { new: true }
    );

    if (!bookmark)
      return res.status(404).json({ success: false, message: "Bookmark not found" });

    res.json({ success: true, bookmark });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE
exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!bookmark)
      return res.status(404).json({ success: false, message: "Bookmark not found" });

    res.json({ success: true, message: "Bookmark deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// FAVORITE TOGGLE
exports.toggleFavorite = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!bookmark)
      return res.status(404).json({ success: false, message: "Bookmark not found" });

    bookmark.isFavorite = !bookmark.isFavorite;
    await bookmark.save();

    res.json({ success: true, bookmark });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
