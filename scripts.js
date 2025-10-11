// All of your book objects are going to be stored in an array, so you’ll need a constructor for books.
// Then, add a separate function to the script (not inside the constructor) that can
// take some arguments, create a book from those arguments, and store the new book object
// into an array.
//  Also, all of your book objects should have a unique id, which can be generated using
// crypto.randomUUID(). This ensures each book has a unique and stable identifier,
// preventing issues when books are removed or rearranged.

//Tracks the elements on the page
const page = {
  form: document.getElementById("bookInfo"),
  display: document.getElementById("showBooks"),
};

//Book objects track attributes of books
function Book(title, author, pageCount, genre, read = false) {
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

//A library is an object that holds an array of books
function Library(books = []) {
  if (!new.target) {
    throw Error("This object must be instantiated with the 'new' keyword");
  }
  this.books = books;
}

Library.prototype.addBook = function (book) {
  this.books.push(book);
};

// Displays library content state at function call to the given page object (removes whatever was there before)
Library.prototype.displayAll = function (page) {
  page.display.textContent = "";
  for (const book in this.books) {
    let fields = Object.keys(this.books[book]);
    console.log(fields);

    const bookCard = document.createElement("div");

    for (const field in fields) {
      const bookDataField = document.createElement("p");
      bookDataField.textContent = `${fields[field]}:  ${
        this.books[book][fields[field]]
      }`;
      // populate book card with another line of <p> wrapped data
      bookCard.appendChild(bookDataField);
    }

    //append book card to document body and move on to next book
    page.display.appendChild(bookCard);
  }
};

//Converts data entered in form to a Book, then saves it in the given Library.
function saveFormData(library, form) {
  const newBookData = new FormData(form);
  console.log(newBookData.get("read"));
  let title = newBookData.get("title");
  let author = newBookData.get("author");
  let pageCount = newBookData.get("pages");
  let genre = newBookData.get("genre");

  let read = newBookData.has("read") ? true : false;

  const userEnteredBook = new Book(title, author, pageCount, genre, read);
  library.addBook(userEnteredBook);
  console.log(library); // for testing
}

//Initializes objects, event listeners, etc.
function init() {
  //tracks the state of the library
  const myLibrary = new Library();

  ///Add some books to library for testing.

  myLibrary.addBook(new Book("Harry Pobber"));
  myLibrary.addBook(new Book("Medibations"));

  //Display library contents
  console.log(myLibrary);
  myLibrary.displayAll(page);

  //Set up event listeners for form.
  page.form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveFormData(myLibrary, e.target);
    e.target.reset();
    myLibrary.displayAll(page);
  });
}

init();
