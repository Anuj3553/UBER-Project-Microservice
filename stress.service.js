const express = require('express');
const morgan = require('morgan');
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;

    console.log(`Master process is running with PID: ${process.pid}`);
    console.log(`Forking ${numCPUs} workers...`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for dying workers and replace them
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });
} else {
    const app = express();

    app.use(morgan('dev')); // Use morgan for logging HTTP requests

    app.get('/stress-test', (req, res) => {
        for (let i = 0; i < 100000000000; i++) {
            // Simulating a heavy computation
        }

        res.send('Hello, World!');
    });

    const PORT = 3002;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running on http://localhost:${PORT}`);
    });
}