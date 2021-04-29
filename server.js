const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4600;
const uuidv1 = require('uuid/v1');
// const apiRoutes = require('./routes/apiRoutes')(app);
// const htmlRoutes = require('./routes/htmlRoutes')(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// app.use('/api', apiRoutes);
// app.use('/', htmlRoutes);

//API Routes
// app.get('/app/notes', (req, res) =>res.json(notesData));

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }
        res.json(JSON.parse(data)); //res.json(JSON.parse(notesdata));
    });
})
app.post('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }
        let notes = JSON.parse(data);
        const newNote = {...req.body,id:uuidv1()}
        notes.push(newNote);
        fs.writeFile('db/db.json', JSON.stringify(notes), err => {
            if (err) {
                throw err;
            }
            res.json(req.body) //res.json(notes)
        })
    });
});

app.delete('/api/notes/:id', (req, res) => {
    //user wants to delete a note
    //which note do they want to delete?
    //edit our "DB" to reflect the delete

    fs.readFile('db/db.json', 'utf8', function read(err, data) {
        if(err) {
            throw err;
        }
        let notes = JSON.parse(data);
        console.log(notes);
        let newNotes = notes.filter((note) => {
            return req.params.id !== note.id;
        });
        console.log(newNotes);

        fs.writeFile('db/db.json', JSON.stringify(newNotes), err => {
            console.log(err);
            res.json({ok:true}) //res.json(notes)
        })
    });
})

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// If no matching route is found default to home
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.listen(PORT, () => console.log(`Listening at ${PORT}`));