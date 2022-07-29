const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 4141;

const app = express();

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET Route for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Resquest notes from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err)
            throw err;
        res.json(JSON.parse(data))
    })
})

// POST Route 
app.post('/api/notes', (req, res) => {
    const createNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4(),
    };
    // Use fs to readFile and add to HTML to display current note
    fs.readFile('db/db.json', 'utf-8', (err, data) => {
        if (err) throw err
        const noteData = JSON.parse(data);
        noteData.push(createNote);
        fs.writeFile('db/db.json', JSON.stringify(noteData), (err) => {
            err ? console.log(err) : console.log("Created new note");
        });
        res.sendFile(path.join(__dirname, '/public/notes.html'));


    })
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));