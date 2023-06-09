const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(res.send(JSON.stringify(books, null, 4)))
        },2000)})
    
    myPromise1.then((successMessage) => {
        return successMessage;
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise2 = new Promise((resolve,reject) => {
        setTimeout(() => {
            const isbn = req.params.isbn;
            resolve(res.send(books[isbn]))
        },2000)})
    
    myPromise2.then((successMessage) => {
        return successMessage;
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise3 = new Promise((resolve,reject) => {
        setTimeout(() => {
            const author = req.params.author;
            Object.values(books).forEach(val => {
                if (val.author === author) 
                resolve(res.send(val));
            });
        },2000)})
    
    myPromise3.then((successMessage) => {
        return successMessage;
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise4 = new Promise((resolve,reject) => {
        setTimeout(() => {
            const title = req.params.title;
            Object.values(books).forEach(val => {
                if (val.title === title) 
                resolve(res.send(val));
            });
        },2000)})
    
    myPromise4.then((successMessage) => {
        return successMessage;
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    return res.send(book.reviews);
});

module.exports.general = public_users;