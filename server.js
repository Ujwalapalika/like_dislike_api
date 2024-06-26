const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./likes.db');

app.use(bodyParser.json());

// Like a post
app.post('/like', (req, res) => {
    const { post_id } = req.body;
    db.run(`INSERT INTO posts (post_id, likes, dislikes)
            VALUES (?, 1, 0)
            ON CONFLICT(post_id) DO UPDATE SET
            likes = likes + 1`,
        [post_id], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Liked successfully' });
            }
        });
});

// Dislike a post
app.post('/dislike', (req, res) => {
    const { post_id } = req.body;
    db.run(`INSERT INTO posts (post_id, likes, dislikes)
            VALUES (?, 0, 1)
            ON CONFLICT(post_id) DO UPDATE SET
            dislikes = dislikes + 1`,
        [post_id], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Disliked successfully' });
            }
        });
});

// Get likes and dislikes for a post
app.get('/stats/:post_id', (req, res) => {
    const { post_id } = req.params;
    db.get(`SELECT likes, dislikes FROM posts WHERE post_id = ?`,
        [post_id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (row) {
                res.json(row);
            } else {
                res.json({ likes: 0, dislikes: 0 });
            }
        });
});

app.get('/stats/:post_id', (req, res) => {
    const { post_id } = req.params;
    db.get(`SELECT likes, dislikes FROM posts WHERE post_id = ?`,
        [post_id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (row) {
                res.json(row);
            } else {
                res.json({ likes: 0, dislikes: 0 });
            }
        });
});

// Get all posts with likes and dislikes
app.get('/posts', (req, res) => {
    db.all(`SELECT * FROM posts`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

