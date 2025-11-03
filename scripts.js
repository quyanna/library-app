/* 
REFACTOR: 
- This refactor aims to change all of the function-based "classes" into actual JS classes. I am also
  trying to take the opportunity to learn about the MVP/MVC pattern (https://developer.mozilla.org/en-US/docs/Glossary/MVC) 
*/

// MODEL: Books, Library

//NOTE: Refactoring book to have priv id and also default to empty fields
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

  // getBookAtIndex(index) {
  //   if (!this.books[index]) return undefined;

  //   return this.books[index];
  // }

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
      toggleReadBtn.textContent = library.books[bookIndex].read
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
      bookCard.dataset.id = bookList[bookIndex].id;
      page.display.appendChild(bookCard);
    }
  }

  onSubmit(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(this.library, e.target);
      this.form.reset();
      this.bookModal.close();
    });
  }

  //   //Set up event listeners for form.
  // this.form.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   saveFormData(myLibrary, e.target);
  //   this.form.reset();
  //   this.bookModal.close();
  //   myLibrary.displayAll(page);
  // });

  // //Show the add book popup when add book button is clicked, and refresh form
  // page.addBookBtn.addEventListener("click", (e) => {
  //   page.form.reset();
  //   page.bookModal.showModal();
  // });

  // //   Close the modal when close button is clicked
  // page.closeBtn.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   page.bookModal.close();
  // });

  // //Event listener for the sort alphabetically button
  // page.sortByTitleBtn.addEventListener("click", (e) => {
  //   myLibrary.sortByTitle();
  //   myLibrary.displayAll(page);
  // });

  // //Remove books from library when the remove button is clicked
  // page.display.addEventListener("click", (e) => {
  //   // if target was a remove button
  //   if (e.target.classList.contains("remove")) {
  //     const card = e.target.closest(".book-card");
  //     if (card) {
  //       const id = card.dataset.id;
  //       myLibrary.removeBook(id);
  //       myLibrary.displayAll(page);
  //     } // if target was a toggle read button
  //   } else if (e.target.classList.contains("toggle-read")) {
  //     const card = e.target.closest(".book-card");
  //     if (card) {
  //       const id = card.dataset.id;
  //       const thisBook = myLibrary.findBookByID(id);
  //       if (thisBook) {
  //         thisBook.toggleRead();
  //         myLibrary.displayAll(page);
  //       }
  //     }
  //   }
  // });

  onAddBook(handler) {}
}

// CONTROLLER

class LibraryController {
  constructor(library, view) {
    this.library = library;
    this.view = view;

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
// // Displays library content state at function call to the given page object (removes whatever was there before)
// Library.prototype.displayAll = function (page) {
//   page.display.textContent = "";
//   const bookList = this.books;

//   for (const bookIndex in bookList) {
//     const bookCard = document.createElement("div");
//     bookCard.classList.add("book-card");
//     Object.entries(bookList[bookIndex]).forEach(([key, value]) => {
//       if (value || value === false) {
//         // Change "true or false" to "Yes or No" for readability (doesn't change actual object value)
//         if (key == "read") {
//           value = value ? "Yes" : "No";
//         }
//         const bookDataField = document.createElement("p");
//         bookDataField.innerHTML = `<span class="book-data-title">${key}: </span> ${value}`;
//         // populate book card with another line of <p> wrapped data
//         bookCard.appendChild(bookDataField);
//       }
//     });

//     //Create a div for buttons
//     const buttonsDiv = document.createElement("div");
//     buttonsDiv.classList.add("btns-div");

//     //Add a "mark as read/unread" button
//     const toggleReadBtn = document.createElement("button");
//     toggleReadBtn.classList.add("toggle-read");
//     toggleReadBtn.textContent = this.books[bookIndex].read
//       ? "Mark as unread"
//       : "Mark as read";

//     //Add a "remove book" button
//     const removeBtn = document.createElement("button");
//     removeBtn.classList.add("remove");
//     removeBtn.textContent = "Remove Book";

//     buttonsDiv.appendChild(toggleReadBtn);
//     buttonsDiv.appendChild(removeBtn);

//     bookCard.appendChild(buttonsDiv);

//     //append book card to document body and move on to next book, associating card with its Book ID
//     bookCard.dataset.id = bookList[bookIndex].id;
//     page.display.appendChild(bookCard);
//   }
// };

// //Converts data entered in form to a Book, then saves it in the given Library.
// function saveFormData(library, form) {
//   const newBookData = new FormData(form);
//   let title = newBookData.get("title");
//   let author = newBookData.get("author");
//   let pageCount = newBookData.get("pages");
//   let genre = newBookData.get("genre");

//   let read = newBookData.has("read") ? true : false;

//   const userEnteredBook = new Book(title, author, pageCount, genre, read);
//   library.addBook(userEnteredBook);
// }

// //Initializes objects, event listeners, etc.
// function init() {
//   //tracks the state of the library
//   const myLibrary = new Library();

//   ///Add some books to library for testing.
//   myLibrary.addBook(
//     new Book(
//       "Harry Potter and the Thinking Rock",
//       "Miku Hatsune",
//       18,
//       "Fantasy",
//       false
//     )
//   );
//   myLibrary.addBook(
//     new Book(
//       "Medibations",
//       "Markiplier League of Legends Aurelia",
//       null,
//       null,
//       true
//     )
//   );

//   myBook = new Book("Hello");
//   console.log(myBook.toString());

//   console.log(myLibrary.toString());

//   //Display library contents
//   myLibrary.displayAll(page);

//   //Set up event listeners for form.
//   page.form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     saveFormData(myLibrary, e.target);
//     page.form.reset();
//     page.bookModal.close();
//     myLibrary.displayAll(page);
//   });

//   //Show the add book popup when add book button is clicked, and refresh form
//   page.addBookBtn.addEventListener("click", (e) => {
//     page.form.reset();
//     page.bookModal.showModal();
//   });

//   //   Close the modal when close button is clicked
//   page.closeBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     page.bookModal.close();
//   });

//   //Event listener for the sort alphabetically button
//   page.sortByTitleBtn.addEventListener("click", (e) => {
//     myLibrary.sortByTitle();
//     myLibrary.displayAll(page);
//   });

//   //Remove books from library when the remove button is clicked
//   page.display.addEventListener("click", (e) => {
//     // if target was a remove button
//     if (e.target.classList.contains("remove")) {
//       const card = e.target.closest(".book-card");
//       if (card) {
//         const id = card.dataset.id;
//         myLibrary.removeBook(id);
//         myLibrary.displayAll(page);
//       } // if target was a toggle read button
//     } else if (e.target.classList.contains("toggle-read")) {
//       const card = e.target.closest(".book-card");
//       if (card) {
//         const id = card.dataset.id;
//         const thisBook = myLibrary.findBookByID(id);
//         if (thisBook) {
//           thisBook.toggleRead();
//           myLibrary.displayAll(page);
//         }
//       }
//     }
//   });
// }

// init();
