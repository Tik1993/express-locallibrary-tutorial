const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  summary: { type: String, required: true },
  ISBN: { type: String, required: true },
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
});

bookSchema.virtual("url").get(function () {
  return `/catalog/book/${this._id}`;
});
module.exports = mongoose.model("Book", bookSchema);
