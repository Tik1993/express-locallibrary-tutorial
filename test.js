const Book = require("./models/Book");
const Genre = require("./models/Genre");
const Author = require("./models/Author");
const BookInstance = require("./models/BookInstance");

const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://admin:admin1234@cluster0.yrjxtci.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
  // await createGenres();
  // await createBooks();
  // await createAuthors();
  // await listBooks();
  // await listAuthors();
  await createBookInstances();
  // await listBookInstance();

  mongoose.connection.close();
}

async function genreCreate(name) {
  const found = await Genre.findOne({ name: name }).select("_id").exec();
  if (found) {
    console.log(`${name} is already added`);
    // console.log(found);
  } else {
    const genre = new Genre({ name: name });
    await genre.save();
    console.log(`Added genre:${name}`);
  }
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    // genreCreate("Fastasy"),
    // genreCreate("Science Fiction"),
    // genreCreate("Romance"),
    genreCreate("Horror"),
  ]);
}

async function bookCreate(title, authorId, summary, ISBN, genre) {
  const found = await Book.findOne({ title });
  if (found) {
  } else {
    const genreId = await Genre.findOne({ name: genre }).select("_id").exec();
    if (genreId) {
      console.log(genreId);
      const book = new Book({
        title,
        author: authorId,
        summary,
        ISBN,
        genre: [genreId],
      });
      await book.save();
      console.log(`${title} is added`);
    } else {
      console.log("Invalid genre");
    }
  }
}

async function createBooks() {
  console.log("Adding book");
  await Promise.all([
    bookCreate(
      "Iron",
      "65f485110d4a4f4aa1b2a17b",
      "nice book",
      "ISBN001",
      "Fastasy"
    ),
    bookCreate(
      "Love",
      "65f485110d4a4f4aa1b2a17b",
      "nic book",
      "ISBN002",
      "Romance"
    ),
  ]);
}

async function listBooks() {
  const books = await Book.find()
    .populate("genre", "name -_id")
    .populate("author");
  console.log(books);
}

async function authorCreate(first_name, last_name, d_birth, d_death) {
  const authorDetail = { first_name, last_name };
  if (d_birth) {
    authorDetail.date_of_birth = d_birth;
  }
  if (d_death) {
    authorDetail.date_of_death = d_death;
  }
  const author = new Author(authorDetail);
  await author.save();
  console.log(`Added author: ${first_name} ${last_name}`);
}

async function createAuthors() {
  await Promise.all([authorCreate("Ernest", "Lin", "1993-12-22", false)]);
}

async function listAuthors() {
  const authors = await Author.find();
  for (let author of authors) {
    console.log(author.fullName);
  }
}

async function bookInstancesCreate(bookId, status, due_back) {
  const bookinstanceDetail = { book: bookId };
  if (status) {
    bookinstanceDetail.status = status;
  }
  if (due_back) {
    bookinstanceDetail.due_back = due_back;
  }
  const bookInstance = new BookInstance(bookinstanceDetail);
  await bookInstance.save();
  console.log("bookinstance is added");
}

async function createBookInstances() {
  console.log("Adding bookinstance");
  await Promise.all([
    bookInstancesCreate("65fdcd42df586b9bf2090b57", "Available"),
  ]);
}

async function listBookInstance() {
  const bookinstances = await BookInstance.find().populate("book", "title");
  console.log(bookinstances);
}
