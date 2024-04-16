const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Genre = require("../models/Genre");
const Book = require("../models/Book");

//Display list of all Genre
const genre_list = asyncHandler(async (req, res, next) => {
  const allGenre = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", { title: "Genre List", genre_list: allGenre });
});

//Display detail page for a specific Genre
const genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

//Display Genre create form on GET
const genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

//Handle Genre create on POST
const genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];
module.exports = {
  genre_list,
  genre_detail,
  genre_create_get,
  genre_create_post,
};
