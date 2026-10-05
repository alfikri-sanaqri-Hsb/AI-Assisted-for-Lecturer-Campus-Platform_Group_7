const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Selamat datang di API Sahabat Alfary!');
});

app.listen(port, () => {
  console.log(`Server Sahabat Alfary berjalan di http://localhost:${port}`);
});