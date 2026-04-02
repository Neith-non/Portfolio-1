const express = require('express');
const morgan = require('morgan');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('index');
});


// --- TIMELINE / UPDATES ROUTE (DYNAMIC) ---
app.get('/updates', (req, res) => {
    
    const timelineData = [
        {
            title: "2nd Year Internship",
            status: "Currently Partaking",
            dateInfo: "2026 // Western Mindanao State University",
            desctitle:"Stepping out of the classroom and into the industry.",
            description: "As a WMSU student, we go out to find a site to internship and learn, help, and gain on-site job experience in a real-world professional environment.",
            link: "/updates/internship",
            linkText: "Read Full Entry"
        }
    ];

    res.render('updates', { events: timelineData });
});

app.get('/catloon', (req, res) => {
    res.render('catloon');
});

// --- NEW ROUTE FOR THE BLOG POST (WITH DYNAMIC DATA) ---
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
                    
                ],
                gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXZuODVqMjAxaG9wazkzYjZxZXJha3NnajdnZGF1cWJsMzNqNnYyayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/08uBcURaMq6vA93TGc/giphy.gif"
            },
            {
                week: "Week 2",
                date: "Feb 25 - Feb 27, 2026",
                title: "Official Intern of St.Joseph",
                content: [
                    "During this period, the focus was on the initial planning phase for the \"Calendar of Events\" school system. My intern team collaborated using Google Docs to brainstorm and draft a detailed questionnaire intended to gather functional requirements from school administration. This draft was prepared for a supervisory consultation with Sir Jv (John Venneth S. Bartolome) to ensure the project scope aligns with the IT department's specific needs.",
                    "A significant administrative milestone was reached on Friday, February 27, with the formal signing of the Memorandum of Understanding (MOU). This event officially transitioned the participants from an orientation stage to recognized intern roles within the Saint Joseph School Foundation. In terms of logistics, 14 hours were logged during the week, bringing the cumulative total for the internship to 21 hours."

                ],
                images: [],
                gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWhpM2c0bDNpNndtbXY3dTJjY2U0NjgzdHF5M25kZTMxczQ1cmowYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xpI9kszfSCMQAr4wmS/giphy.gif"
            }
        ]
    };

    res.render('blog-post', { data: internshipData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.use((req, res) => {
    res.status(404).render('404', {title: '404'})
});


