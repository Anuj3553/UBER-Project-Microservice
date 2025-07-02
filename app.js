const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev')); // Use morgan for logging HTTP requests

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});