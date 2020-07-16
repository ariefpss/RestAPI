const http = require('http');
const app = require('./app.js');

const port = process.env.port || 8080;
const server = http.createServer(app);

server.listen(port,'0.0.0.0', () => {
    console.log("server berjalanan di http://localhost:8080");
});