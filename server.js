// requireds....
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const file = 'leaderboard.json';

app.get('/leaderboard', (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  res.json(data);
});

// lisää pisteet jsoniin :)
app.post('/leaderboard', (req, res) => {
  const newEntry = req.body;
  const data = JSON.parse(fs.readFileSync(file));
  data.push(newEntry);
});

app.listen(3000, () => console.log('Server running on port 3000'));
