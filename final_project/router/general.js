const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
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
       return res.status(200).json({message: filtered_books});
    } else {
        return res.status(404).json({message: "No books found for ISBN"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksArray = Object.values(books);
    const author = req.params.author;
    const filtered_books = booksArray.filter(book => book.author === author);

    if (filtered_books.length > 0) {
        return res.status(200).json({message: filtered_books});
    } else {
        return res.status(404).json({message: "No books found for Author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksArray = Object.values(books);
    const title = req.params.title;
    const filtered_books = booksArray.filter(book => book.title === title);

    if (filtered_books.length > 0) {
        return res.status(200).json({message: filtered_books});
    } else {
        return res.status(404).json({message: "No books found for Title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let booksArray = Object.values(books);
    const isbn = req.params.isbn;
    const filtered_books = booksArray.filter(book => book.isbn === isbn);

    if (filtered_books.length > 0) {
        const review = filtered_books[0].reviews
        return res.status(200).json({message: review});
    } else {
        return res.status(404).json({message: "No reviews for ISBN"});
    }
});

module.exports.general = public_users;
