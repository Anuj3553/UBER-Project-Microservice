const autocannon = require('autocannon');

const urls = ['http://localhost:3000', 'http://localhost:3000/stress-test'];
const duration = 30; // Test duration in seconds

urls.forEach(url => {
    autocannon({
        url,
        duration,
    }, (err, result) => {
        if (err) {
            console.error('Error occurred:', err);
            return;
        }
        else {
            console.log(`URL: ${url}`);
            console.log("Number of requests:", result.requests.total);
            console.log("Duration (seconds):", result.duration);
        }
    });
});
