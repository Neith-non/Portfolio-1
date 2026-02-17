const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const path = require('path');
require('ejs'); 

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
    res.render('index');
});

// --- NEW ROUTE ADDED HERE ---
app.get('/updates', (req, res) => {
    res.render('updates');
});
// ---------------------------

app.get('/catloon', (req, res) => {
    res.render('catloon');
});


app.use((req, res) => {
    res.status(404).render('404', {title: '404 - Not Found'});
});

module.exports.handler = serverless(app, {
    binary: ['image/*']
});