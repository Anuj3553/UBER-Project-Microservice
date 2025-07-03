const express = require('express');
const app = express();
const proxy = require('express-http-proxy');

app.use('/stress-test', proxy('http://localhost:3002'));
app.use('/', proxy('https://kvvp2fl4-3001.inc1.devtunnels.ms'));

app.listen(3000, () => {
    console.log('Gateway service is running on http://localhost:3000');
});