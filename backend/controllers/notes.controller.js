const Note = require("../models/note.model");
const {
  createNoteSchema,
  updateNoteSchema
} = require("../validations/note.validation");


// CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    const data = createNoteSchema.parse(req.body);

    const note = await Note.create({
      ...data,
      user: req.user.userId
    });

    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// GET ALL NOTES (SEARCH + FILTER)
exports.getNotes = async (req, res) => {
  try {
    const { q, tags } = req.query;

    let query = { user: req.user.userId };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(",");
      query.tags = { $in: tagArray };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET SINGLE NOTE
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// UPDATE NOTE
exports.updateNote = async (req, res) => {
  try {
    const data = updateNoteSchema.parse(req.body);

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      data,
      { new: true }
    );

    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });

    res.json({ success: true, note });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE NOTE
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });

    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// TOGGLE FAVORITE
exports.toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!note)
      return res.status(404).json({ success: false, message: "Note not found" });

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
