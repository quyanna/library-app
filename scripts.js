/* 
REFACTOR: 
- This refactor aims to change all of the function-based "classes" into actual JS classes. I am also
  trying to take the opportunity to learn about the MVP/MVC pattern (https://developer.mozilla.org/en-US/docs/Glossary/MVC) 

This refactor organizes the functionality into classes as follows: 
  Model: Books, Library
  View: LibraryViewer
  Controller: LibraryController
*/

// MODEL: Books, Library

//NOTE: Refactored book to have priv id and also default to empty fields
class Book {
  #id;
  constructor(
    title = "",
    author = "",
    pageCount = "",
    genre = "",
    read = false
  ) {
    this.#id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this["page count"] = pageCount;
    this.genre = genre;
    this.read = read;
  }

  get id() {
    return this.#id;
  }

  toggleRead() {
    this.read = !this.read;
  }
}

//Tracks the elements on the page
const page = {
  form: document.getElementById("addBookForm"),
  display: document.getElementById("showBooks"),
  bookModal: document.getElementById("addBookDialog"),
  addBookBtn: document.getElementById("addBookBtn"),
  closeBtn: document.getElementById("close"),
  sortByTitleBtn: document.getElementById("sortByTitleBtn"),
};

//TODO: MAYBE A GETTER FOR BOOKS TO AVOID BOOKS BEING ALTERED INTERNALLY

class Library {
  constructor(books = []) {
    this.books = books;
  }

  addBook(book) {
    if (book instanceof Book) this.books.push(book);
  }

  //Removes book by ID, unless book is not found, then does nothing
  removeBook(searchID) {
    const index = this.#getIndexOfBook(searchID);
    if (index != -1) {
      this.books.splice(index, 1);
    }
  }

  //Gets the index of a library's "books" of a book with the given ID, otherwise returns -1.
  #getIndexOfBook(searchID) {
    let bookList = this.books;
    const index = bookList.findIndex((book) => {
      return book.id === searchID;
    });

    return index;
  }

  //Return a reference to the book with the given ID in this library, otherwise return undefined
  findBookByID(searchId) {
    const index = this.#getIndexOfBook(searchId);
    if (index === -1) return undefined;

    return this.books[index];
  }

  //Sorts the library by title (alphabetically)
  sortByTitle() {
    let bookList = this.books; // get a reference to the array of books

    bookList.sort((bookA, bookB) => {
      const title1 = bookA.title.toUpperCase();
      const title2 = bookB.title.toUpperCase();

      return title1.localeCompare(title2, "en");
    });
  }
}

// VIEW

class LibraryViewer {
  constructor() {
    this.form = document.getElementById("addBookForm");
    this.display = document.getElementById("showBooks");
    this.bookModal = document.getElementById("addBookDialog");
    this.addBookBtn = document.getElementById("addBookBtn");
    this.closeBtn = document.getElementById("close");
    this.sortByTitleBtn = document.getElementById("sortByTitleBtn");

    //Show modal and reset form when add book button is pressed
    this.addBookBtn.addEventListener("click", (e) => {
      this.form.reset();
      this.bookModal.showModal();
    });

    //   Close the modal when close button is clicked
    this.closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.bookModal.close();
    });
  }

  //Displays library output to the DOM (Assumes existence of a DOM Element with ID "showBooks"), preferably a div.
  // Each book is displayed as a "card" with a "Read/Unread" button and a "Remove" button.
  displayAll(library) {
    this.display.textContent = "";
    const bookList = library.books;

    for (const bookIndex in bookList) {
      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");

      //Populate book card with data entries in Book
      Object.entries(bookList[bookIndex]).forEach(([key, value]) => {
        if (value || value === false) {
          // Change "true or false" to "Yes or No" for readability (doesn't change actual object value)
          if (key == "read") {
            value = value ? "Yes" : "No";
          }
          const bookDataField = document.createElement("p");
          bookDataField.innerHTML = `<span class="book-data-title">${key}: </span> ${value}`;
          // populate book card with another line of <p> wrapped data
          bookCard.appendChild(bookDataField);
        }
      });

      //Create a div for buttons
      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("btns-div");

      //Add a "mark as read/unread" button
      const toggleReadBtn = document.createElement("button");
      toggleReadBtn.classList.add("toggle-read");
      toggleReadBtn.dataset.action = "toggle";
      toggleReadBtn.textContent = library.books[bookIndex].read
        ? "Mark as unread"
        : "Mark as read";

      //Add a "remove book" button
      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove");
      removeBtn.dataset.action = "remove";
      removeBtn.textContent = "Remove Book";

      buttonsDiv.appendChild(toggleReadBtn);
      buttonsDiv.appendChild(removeBtn);

      bookCard.appendChild(buttonsDiv);

      //append book card to document body and move on to next book, associating card with its Book ID
      bookCard.dataset.id = bookList[bookIndex].id;
      page.display.appendChild(bookCard);
    }
  }

  // Called when form to add a new book is submitted
  onSubmitForm(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bookData = new FormData(e.target);
      handler(bookData);
      this.form.reset();
      this.bookModal.close();
    });
  }

  // Called when one of the buttons on the book "cards" is clicked
  onCardClick(handler) {
    this.display.addEventListener("click", (e) => {
      const btnClicked = e.target.closest("[data-action]");
      if (!btnClicked) return;

      const action = btnClicked.dataset.action;
      const id = e.target.closest("[data-id]")?.dataset.id;

      switch (action) {
        case "toggle":
          handler({ type: "toggle", id });
          break;
        case "remove":
          handler({ type: "remove", id });
          break;
      }
    });
  }

  onSortByTitle(handler) {
    this.sortByTitleBtn.addEventListener("click", handler);
  }
}

// CONTROLLER

class LibraryController {
  constructor(library, view) {
    this.library = library;
    this.view = view;

    view.onCardClick(({ type, id }) => {
      if (type == "toggle") {
        const book = this.library.findBookByID(id);
        if (book) {
          book.toggleRead();
        }
        this.view.displayAll(library);
      }
      if (type == "remove") {
        this.library.removeBook(id);
        this.view.displayAll(library);
      }
    });

    view.onSubmitForm((formData) => {
      let title = formData.get("title");
      let author = formData.get("author");
      let pageCount = formData.get("pages");
      let genre = formData.get("genre");
      let read = formData.has("read") ? true : false;

      const newBook = new Book(title, author, pageCount, genre, read);
      this.library.addBook(newBook);
      view.displayAll(this.library);
    });

    view.onSortByTitle(() => {
      this.library.sortByTitle();
      this.view.displayAll(this.library);
    });

    //Add some initial books just for demo purposes
    this.library.addBook(
      new Book(
        "Harry Potter and the Thinking Rock",
        "Miku Hatsune",
        18,
        "Fantasy",
        false
      )
    );
    this.library.addBook(
      new Book(
        "Medibations",
        "Markiplier League of Legends Aurelia",
        null,
        null,
        true
      )
    );
    console.log(this.library);

    //Initial render
    this.view.displayAll(this.library);
  }
}

init = new LibraryController(new Library(), new LibraryViewer());
