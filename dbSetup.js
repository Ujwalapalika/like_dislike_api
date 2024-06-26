const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./likes.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database opened successfully');
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            post_id TEXT PRIMARY KEY,
            likes INTEGER DEFAULT 0,
            dislikes INTEGER DEFAULT 0
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Table created successfully');
            }
        });
    }
});
