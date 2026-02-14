const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    isFavorite: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
