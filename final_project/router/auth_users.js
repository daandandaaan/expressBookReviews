const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password) => { //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60});
  
        req.session.authorization = {accessToken,username}
        return res.status(200).send("User successfully logged in");
    } else return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    let exist = false;

    if (review != NaN) {
        let book = books[isbn];

        // If book's reviews are empty
        if (JSON.stringify(book.reviews) == '{}'){
            book.reviews = [{username: req.session.authorization.username, review: review}]
            return res.send(book);
        }

        //Check if the array of book reviews contains the username
        book.reviews.forEach(element => {
            if (element.username == req.session.authorization.username){
                element.review = review;
                exist = true;
            }
        });
        
        if (!exist) {
            // If user doesn't exist add new review
            book.reviews.push({username: req.session.authorization.username, review: review}); 
        }        
        
        return res.send(book);
    }    
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    //users = users.filter((user) => user.email != email);
    book.reviews = book.reviews.filter(function (item) {
        return item.username != req.session.authorization.username
    });
    console.log(book.reviews)

    return res.send(book);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;