const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key', //muuta
  resave: false,
  saveUninitialized: true
}));

// db yhteys
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'your_user',
  password: 'your_pass',
  database: 'your_db'
});

// login req
app.post('/login', async (req, res) => {
  const { user, psw } = req.body;
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [user]);
  
  if (rows.length === 0) return res.status(401).send('kayttaja ei loydetty');
  const valid = await bcrypt.compare(psw, rows[0].password_hash);
  
  if (!valid) return res.status(403).send('salasana virheellinen');
  req.session.userId = rows[0].id;
  res.json({ message: 'kirjautuminen onnistunut', user: user });
});

// pisteet
app.post('/submit-score', async (req, res) => {
  const { score, time } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).send('Not logged in');

  await db.execute('INSERT INTO scores (user_id, score, time_seconds) VALUES (?, ?, ?)', [userId, score, time]);
  res.send('Score saved');
});

app.get('/leaderboard', async (req, res) => {
  const [rows] = await db.execute(`
    SELECT u.username AS nimi, s.score AS pisteet, s.time_seconds AS aika
    FROM scores s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.score DESC
    LIMIT 10
  `);
  res.json(rows);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
