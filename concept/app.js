const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev')); // Use morgan for logging HTTP requests

app.get('/', (req, res) => {
    for (let i = 0; i < 1000000000; i++) {

    }

    res.send('Hello, World!');
});

app.get('/stress-test', (req, res) => {
    for (let i = 0; i < 1000000000; i++) {
    }
    res.send('Stress Test Endpoint');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});