const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let booksArray = Object.values(books);
    const isbn = req.params.isbn;
    const filtered_books = booksArray.filter(book => book.isbn === isbn);

    if (filtered_books.length > 0) {
       res.send(JSON.stringify({filtered_books}, null, 4));
    } else {
        res.send("No books found for this isbn.");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksArray = Object.values(books);
    const author = req.params.author;
    const filtered_books = booksArray.filter(book => book.author === author);

    if (filtered_books.length > 0) {
        res.send(JSON.stringify({filtered_books}, null, 4));
    } else {
        res.send("No books found for this author.");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksArray = Object.values(books);
    const title = req.params.title;
    const filtered_books = booksArray.filter(book => book.title === title);

    if (filtered_books.length > 0) {
        res.send(JSON.stringify({filtered_books}, null, 4));
    } else {
        res.send("No books found for this title.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let booksArray = Object.values(books);
    const isbn = req.params.isbn;
    const filtered_books = booksArray.filter(book => book.isbn === isbn);

    if (filtered_books.length > 0) {
        const review = filtered_books[0].reviews
        res.send(JSON.stringify({review}, null, 4));
    } else {
        res.send("No books found for this isbn.");
    }
});

module.exports.general = public_users;
