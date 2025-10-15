//Tracks the elements on the page
const page = {
  form: document.getElementById("addBookForm"),
  display: document.getElementById("showBooks"),
  bookModal: document.getElementById("addBookDialog"),
  addBookBtn: document.getElementById("addBookBtn"),
  closeBtn: document.getElementById("close"),
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

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

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

//Removes book by ID
Library.prototype.removeBook = function (searchID) {
  const index = this.getIndexOfBook(searchID);
  if (index != -1) {
    this.books.splice(index, 1);
  }
};

//Gets the index of a library's "books" of a book with the given ID, otherwise returns -1.
Library.prototype.getIndexOfBook = function (searchID) {
  bookList = this.books;
  const index = bookList.findIndex((book) => {
    return book.id === searchID;
  });

  return index;
};
// Displays library content state at function call to the given page object (removes whatever was there before)
Library.prototype.displayAll = function (page) {
  page.display.textContent = "";
  for (const book in this.books) {
    let fields = Object.keys(this.books[book]);
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    //for each field in a given book
    for (const field in fields) {
      let currentBookField = this.books[book][fields[field]];
      //   Make sure we display the "read" value even if it is false
      if (currentBookField || currentBookField === false) {
        const bookDataField = document.createElement("p");
        bookDataField.innerHTML = `<span class="book-data-title">${fields[field]}: </span> ${currentBookField}`;
        // populate book card with another line of <p> wrapped data
        bookCard.appendChild(bookDataField);
      }
    }

    //Create a div for buttons
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("btns-div");

    //Add a "mark as read/unread" button
    const toggleReadBtn = document.createElement("button");
    toggleReadBtn.classList.add("toggle-read");
    toggleReadBtn.textContent = this.books[book].read
      ? "Mark as unread"
      : "Mark as read";

    //Add a "remove book" button
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove");
    removeBtn.textContent = "Remove Book";

    buttonsDiv.appendChild(toggleReadBtn);
    buttonsDiv.appendChild(removeBtn);

    bookCard.appendChild(buttonsDiv);

    //append book card to document body and move on to next book, associating card with its Book ID
    bookCard.dataset.id = this.books[book].id;
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
  myLibrary.addBook(
    new Book(
      "Harry Pobber and the Thinking Rock",
      "Miku Hatsune",
      18,
      "Fantasy",
      false
    )
  );
  myLibrary.addBook(
    new Book(
      "Medibations",
      "Markiplier League of Legends Aurelia",
      null,
      null,
      true
    )
  );

  //Display library contents
  console.log(myLibrary);
  myLibrary.displayAll(page);

  //Set up event listeners for form.
  page.form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveFormData(myLibrary, e.target);
    page.form.reset();
    page.bookModal.close();
    myLibrary.displayAll(page);
  });

  //Show the add book popup when add book button is clicked, and refresh form
  page.addBookBtn.addEventListener("click", (e) => {
    page.form.reset();
    page.bookModal.showModal();
  });

  //   Close the modal when close button is clicked
  page.closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    page.bookModal.close();
  });

  //Remove books from library when the remove button is clicked
  page.display.addEventListener("click", (e) => {
    // if target was a remove button
    if (e.target.classList.contains("remove")) {
      const card = e.target.closest(".book-card");
      if (card) {
        const id = card.dataset.id;
        myLibrary.removeBook(id);
        myLibrary.displayAll(page);
      } // if target was a toggle read button
    } else if (e.target.classList.contains("toggle-read")) {
      const card = e.target.closest(".book-card");
      if (card) {
        const id = card.dataset.id;
        const index = myLibrary.getIndexOfBook(id);
        if (index !== -1) {
          myLibrary.books[index].toggleRead();
          myLibrary.displayAll(page);
        }
      }
    }
  });
}

init();
