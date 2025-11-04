# library-app

Simple JS library app to practice object-oriented design and dynamic front-end layouts with vanilla HTML/CSS.
Storage doesn't persist between uses. You can add books, remove books, and sort them alphabetically.

### What I learned/practiced (at a small scale)

- Object oriented programming

  - Originally this app was built using **function constructors** and prototypes to encapsulate data and methods. Through this, I learned about JavaScript's prototype chain, and about how classes are represented in this language.

- MVC Architecture
  - Model: The Book class handles all data associated with books, such as author, title, etc. The Library class represents a collection of Books.
  - View: Updates the DOM with a LibraryViewer class, which also handles all UI interactions.
  - Controller: The LibraryController class acts as a mediator between the Model and the View.
