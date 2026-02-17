const express = require('express');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/updates', (req, res) => {
    res.render('updates');
});

app.get('/catloon', (req, res) => {
    res.render('catloon');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.use((req, res) => {
    res.status(404).render('404', {title: '404'})
});


