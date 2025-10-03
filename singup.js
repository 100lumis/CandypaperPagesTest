document.getElementById('signup').addEventListener('submit', async (e) => {
  e.preventDefault();

  // formidataaaa
  const formData = new FormData(e.target);
  const user = formData.get('user').trim();
  const psw = formData.get('psw');
  const confirmPsw = formData.get('confirmPsw');

  if (psw !== confirmPsw) {
    alert('Salasanat ei täsmää!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password: psw })
    });

    if (res.ok) {
      alert('Rekisteröityminen onnistui! Voit nyt kirjautua sisään.');
      e.target.reset();
    } else {
      const data = await res.json();
      alert('Virhe rekisteröitymisessä: ' + data.message);
    }
  } catch (error) {
    alert('Palvelinvirhe. Yritä myöhemmin uudelleen.');
  }
});

const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'youruser',
  password: 'yourpassword',
  database: 'yourdb'
});

app.post('/signup', async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    // tarkista onko käyttäjä olemassa
    const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [user]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Käyttäjänimi on jo käytössä' });
    }

    // pass hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // laittaa käyttäjiin
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [user, hashedPassword]);

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

