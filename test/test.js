const autocannon = require('autocannon');

const url = 'http://localhost:3000';
const duration = 30; // Test duration in seconds

const instance = autocannon({
    url,
    duration,
}, (err, result) => {
    if (err) {
        console.error('Error occurred:', err);
        return;
    }
    console.log('Test results:', result);
});

autocannon.track(instance);

instance.on('done', () => {
    console.log('Test completed');
});
