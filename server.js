const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const db = new sqlite3.Database('albumok.db');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

db.run(`CREATE TABLE IF NOT EXISTS albumok (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zenekar TEXT,
  cim TEXT,
  ev INTEGER,
  mufaj TEXT
)`);

app.get('/albumok', (req, res) => {
  db.all('SELECT * FROM albumok ORDER BY zenekar', [], (err, rows) => {
    res.json(rows);
  });
});

app.get('/albumok/:id', (req, res) => {
  db.get('SELECT * FROM albumok WHERE id = ?', [req.params.id], (err, row) => {
    res.json(row);
  });
});

app.post('/albumok', (req, res) => {
  const { zenekar, cim, ev, mufaj } = req.body;
  db.run('INSERT INTO albumok (zenekar, cim, ev, mufaj) VALUES (?, ?, ?, ?)', [zenekar, cim, ev, mufaj], function(err) {
    res.json({ id: this.lastID });
  });
});

app.put('/albumok/:id', (req, res) => {
  const { zenekar, cim, ev, mufaj } = req.body;
  db.run('UPDATE albumok SET zenekar = ?, cim = ?, ev = ?, mufaj = ? WHERE id = ?', [zenekar, cim, ev, mufaj, req.params.id], function(err) {
    res.json({ updated: this.changes });
  });
});

app.delete('/albumok/:id', (req, res) => {
  db.run('DELETE FROM albumok WHERE id = ?', [req.params.id], function(err) {
    res.status(204).end();
  });
});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/albumok.html');
});

app.listen(3000, () => {
  console.log('Server runs on: http://localhost:3000');
});
