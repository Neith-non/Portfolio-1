const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware
app.use(morgan('dev'));

// IMPORTANT: Fix static file serving for Serverless
// This points to the 'public' folder relative to where this function runs
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('view engine', 'ejs');
// IMPORTANT: Point to 'views' relative to this function
app.set('views', path.join(__dirname, '../views'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404', {title: '404 - Not Found'});
});

// Export the handler for Netlify
module.exports.handler = serverless(app);