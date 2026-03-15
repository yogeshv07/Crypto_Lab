///server.js
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3500;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();

  // Determine content type
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
  };

  const contentType = contentTypes[ext] || 'text/plain';

  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Stop the existing server or run with a different port, for example: $env:PORT=3501; node .\\server.js`
    );
    process.exit(1);
  }

  console.error(err);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
