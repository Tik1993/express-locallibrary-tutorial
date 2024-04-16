const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

authorSchema.virtual("fullName").get(function () {
  return this.first_name + " " + this.last_name;
});

authorSchema.virtual("lifespan").get(function () {
  let death = this.date_of_death ? this.date_of_death : "";
  return this.date_of_birth + "-" + death;
});

authorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});
module.exports = mongoose.model("Author", authorSchema);
