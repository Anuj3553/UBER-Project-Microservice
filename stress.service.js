const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev')); // Use morgan for logging HTTP requests

app.get('/stress-test', (req, res) => {
    for (let i = 0; i < 100000000000; i++) {
        // Simulating a heavy computation
    }

    res.send('Hello, World!');
});


app.listen(3002, () => {
    console.log('Stress service is running on http://localhost:3002');
});