const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const path = require('path');
require('ejs'); // <--- CRITICAL: Forces Netlify to bundle EJS

const app = express();

// Middleware
app.use(morgan('dev'));

// Serve static files (images, css)
// We use '../public' because this file is inside the 'functions' folder
app.use(express.static(path.join(__dirname, '../public')));

// View Engine Setup
app.set('view engine', 'ejs');
app.use(express.static("../public"))
// We use '../views' to point to the folder outside 'functions'
app.set('views', path.join(__dirname, '../views'));

// Main Route
app.get('/', (req, res) => {
    res.render('index');
});

// 404 Handler (Page Not Found)
app.use((req, res) => {
    // If you haven't created a 404.ejs yet, this might error. 
    // You can safely use res.status(404).send("Page not found") if 404.ejs is missing.
    res.status(404).render('404', {title: '404 - Not Found'});
});

// Change this:
// module.exports.handler = serverless(app);

// To this:
module.exports.handler = serverless(app, {
    binary: ['image/*'] // Tells the function "Don't mess up my images!"
});