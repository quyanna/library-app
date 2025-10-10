// All of your book objects are going to be stored in an array, so you’ll need a constructor for books.
// Then, add a separate function to the script (not inside the constructor) that can
// take some arguments, create a book from those arguments, and store the new book object
// into an array.
//  Also, all of your book objects should have a unique id, which can be generated using
// crypto.randomUUID(). This ensures each book has a unique and stable identifier,
// preventing issues when books are removed or rearranged.

const myLibrary = [];

function Book(
  title = `unknown`,
  author = `unknown`,
  pageCount = `unknown`,
  genre = `unknown`,
  read = `unknown`
) {
  if (!new.target) {
    throw Error("This object must be instantiated with the 'new' keyword");
  }

  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pageCount = pageCount;
  this.genre = genre;
  this.read = read;
}

function addBookToLibrary(book, library) {
  //Adds a book to the given library.
  library.push(book);
}

let newBook = new Book("Harry Pobber");
let newBook2 = new Book("Medibations");
addBookToLibrary(newBook, myLibrary);
console.log(myLibrary);
addBookToLibrary(newBook2, myLibrary);
console.log(myLibrary);

let noInfo = new Book("Title");
console.log(noInfo);
