const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {"username":"user1","password":"password1"},
    {"username":"user2","password":"password2"},
    {"username":"user3","password":"password3"} 
];

const isValid = (username)=>{ //returns boolean
    // Find a user with the matching username
    const user = users.find(u => u.username === username);
    // Return true if the username is found, false otherwise
    return !!user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Find a user with the matching username and password
    const user = users.find(u => u.username === username && u.password === password);
    // Return true if a user is found, false otherwise
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    // Get the username from the session after authentication
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review is missing in the query." });
    }
    
    // Find the book by its ISBN
    const bookToUpdate = Object.values(books).find(book => book.isbn === isbn);

    if (!bookToUpdate) {
        return res.status(404).json({ message: "Book not found for the given ISBN." });
    }
    
    // Check if the user has already reviewed the book
    if (bookToUpdate.reviews[username]) {
        // Update the existing review
        bookToUpdate.reviews[username] = review;
        return res.status(200).json({ message: `Review for ISBN ${isbn} updated.` });
    } else {
        // Add a new review
        bookToUpdate.reviews[username] = review;
        return res.status(201).json({ message: `Review for ISBN ${isbn} added successfully.` });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    // Get the username from the session after authentication
    const username = req.session.authorization.username;

    // Find the book by its ISBN
    const bookToDelete = Object.values(books).find(book => book.isbn === isbn);

    if (!bookToDelete) {
        return res.status(404).json({ message: "Book not found for the given ISBN." });
    }
    
    // Check if the user has a review for the book
    if (bookToDelete.reviews[username]) {
        // Delete the review from the book's reviews object
        delete bookToDelete.reviews[username];
        return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} deleted.` });
    } else {
        return res.status(404).json({ message: `No review found for ISBN ${isbn} from user ${username}` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;