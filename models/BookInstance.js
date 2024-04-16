const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const bookInstanceSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, required: true, default: Date.now },
});

bookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

bookInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate(); // format 'YYYY-MM-DD'
});

bookInstanceSchema.virtual("url").get(function () {
  return `/catalog/bookinstance/${this._id}`;
});
module.exports = mongoose.model("BookInstance", bookInstanceSchema);
