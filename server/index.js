const http = require('node:http');

const server = http.createServer((req, res) => {
  console.log(`received request to: ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

const host = '0.0.0.0';
const port = 9999;

server.listen(port, host, () => {
  console.info(`server started at http://${host}:${port}`);
});
