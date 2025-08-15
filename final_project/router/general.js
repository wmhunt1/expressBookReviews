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
const fetchAllBooksAsync = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 500); 
    });
};

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
      const bookList = await fetchAllBooksAsync(); 
      res.json(bookList); // Neatly format JSON output
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book list" });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const bookList = await fetchAllBooksAsync(); 
        const filtered_books = bookList.filter(book => book.isbn === isbn);
        res.json(filtered_books); // Neatly format JSON output
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
      }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    try {
        const bookList = await fetchAllBooksAsync(); 
        const filtered_books = bookList.filter(book => book.author === author);
        res.json(filtered_books); // Neatly format JSON output
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
      }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    try {
        const bookList = await fetchAllBooksAsync(); 
        const filtered_books = bookList.filter(book => book.title === title);
        res.json(filtered_books); // Neatly format JSON output
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
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
