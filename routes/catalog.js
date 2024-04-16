const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authorContoller = require("../controllers/authorController");
const bookinstanceContoller = require("../controllers/bookinstanceController");
const genreController = require("../controllers/genreController");

//Book routes//
// GET catalog home page.
router.get("/", bookController.index);

//GET request for creating a book
router.get("/book/create", bookController.book_create_get);

//POST request for creating a book
router.post("/book/create", bookController.book_create_post);

//GET request to update Book
router.get("/book/:id/update", bookController.book_update_get);

//POST request to update Book
router.post("/book/:id/update", bookController.book_update_post);

//GET request for one Book
router.get("/book/:id", bookController.book_detail);

//GET request for list of all Book items.
router.get("/books", bookController.book_list);

//Author routes//
//GET request for creating a author
router.get("/author/create", authorContoller.author_create_get);

//POST request for creating author
router.post("/author/create", authorContoller.author_create_post);

//GET request to delete Author
router.get("/author/:id/delete", authorContoller.author_delete_get);

//POST request to delete Author
router.post("/author/:id/delete", authorContoller.author_delete_post);

//GET request for list of all Authors
router.get("/authors", authorContoller.author_list);

// GET request for one Author
router.get("/author/:id", authorContoller.author_detail);

//Genre routes//
//GET request for creating a Genre
router.get("/genre/create", genreController.genre_create_get);

//POST request for creating Genre
router.post("/genre/create", genreController.genre_create_post);

//GET request for list of all Genre
router.get("/genres", genreController.genre_list);

// GET request for one Genre.
router.get("/genre/:id", genreController.genre_detail);

//Bookinstance routes//
//GET request for creating a Bookinstances
router.get(
  "/bookinstance/create",
  bookinstanceContoller.bookinstance_create_get
);

//POST request for creating Bookinstances
router.post(
  "/bookinstance/create",
  bookinstanceContoller.bookinstance_create_post
);

//GET request for list of all Bookinstances
router.get("/bookinstances", bookinstanceContoller.bookinstance_list);

// GET request for one Bookinstance.
router.get("/bookinstance/:id", bookinstanceContoller.bookinstance_detail);

module.exports = router;
