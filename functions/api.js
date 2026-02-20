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

app.get('/updates', (req, res) => {
    res.render('updates');
});

app.get('/catloon', (req, res) => {
    res.render('catloon');
});

app.get('/updates/internship', (req, res) => {
    
    const internshipData = {
        title: "Stepping out of the classroom and into the industry.",
        intro: "As a College of Computing Studies student at Western Mindanao State University (WMSU), one of our major milestones is the 2nd-year internship. It’s the bridge between the academic theories we study and the real-world application of code.",
        logs: [
            {
                week: "Week 1",
                date: "Feb 15 - Feb 20, 2026",
                title: "The Start Of The Beginning",
                content: [
                    "In this week me and my intern mates got to know the person and environment that we will be working with. We made mistakes but mistakes comes with a lesson and we as a student learned from it.",
                    ""
                ],
                images: [
                    "https://placehold.co/600x400/354c7c/eaebfe?text=Site+Hunting+Photo+1",
                    "https://placehold.co/600x400/354c7c/eaebfe?text=Site+Hunting+Photo+2"
                ],
                // Place your funny gif here!
                gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXZuODVqMjAxaG9wazkzYjZxZXJha3NnajdnZGF1cWJsMzNqNnYyayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/08uBcURaMq6vA93TGc/giphy.gif"
            },
            {
                week: "Week 2",
                date: "Feb 23 - Feb 27, 2026",
                title: "Awaiting Placement...",
                content: [
                    "I will be updating this space as I secure a site and progress through the internship. Documenting the challenges faced and the solutions developed along the way. Stay tuned."
                ],
                images: [],
                // Place your funny gif here!
                gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWhpM2c0bDNpNndtbXY3dTJjY2U0NjgzdHF5M25kZTMxczQ1cmowYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xpI9kszfSCMQAr4wmS/giphy.gif"
            }
        ]
    };

    res.render('blog-post', { data: internshipData });
});

app.use((req, res) => {
    res.status(404).render('404', {title: '404 - Not Found'});
});

module.exports.handler = serverless(app, {
    binary: ['image/*']
});