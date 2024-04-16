const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Author = require("../models/Author");
const Book = require("../models/Book");

//Diplay list of all Authors
const author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ last_name: 1 }).exec();
  res.render("author_list", { title: "Author List", author_list: allAuthors });
});

//// Display detail page for a specific Author
const author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});

//Deplay author create form on GET
const author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
};

//Handle author create on POST
const author_create_post = [
  body("fname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified."),
  body("lname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified."),
  // body("dob").optional({ value: "falsy" }).isISO8601().toDate(),
  // body("dod").optional({ value: "falsy" }).isISO8601().toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.fname,
      last_name: req.body.lname,
      date_of_birth: req.body.dob,
      date_of_death: req.body.dod,
    });

    if (!errors.isEmpty()) {
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
    } else {
      await author.save();
      res.redirect(author.url);
    }
  }),
];

// Display Author delete form on GET.
const author_delete_get = asyncHandler(async (req, res, next) => {
  const [author, allBookByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete Author",
    author: author,
    author_books: allBookByAuthor,
  });
});

// Handle Author delete on POST.
const author_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors");
  }
});

module.exports = {
  author_list,
  author_detail,
  author_create_get,
  author_create_post,
  author_delete_get,
  author_delete_post,
};
