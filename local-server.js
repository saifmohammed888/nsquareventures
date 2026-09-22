const http = require('http');
const fs = require('fs');
const path = require('path');
const content = require('./api/content');
const upload = require('./api/upload');

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

process.env.CMS_PASSWORD = process.env.CMS_PASSWORD || 'admin123';

function decorateResponse(res){
  res.status = code => {
    res.statusCode = code;
    return res;
  };
  res.json = data => {
    if(!res.headersSent) res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };
  return res;
}

function serve(file, res){
  fs.readFile(file, (error, data) => {
    if(error){
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}

http.createServer((req, res) => {
  decorateResponse(res);
  const url = new URL(req.url, `http://localhost:${port}`);
  req.query = Object.fromEntries(url.searchParams.entries());

  if(url.pathname === '/api/content') return content(req, res);
  if(url.pathname === '/api/upload') return upload(req, res);

  let pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  if(pathname === '/admin') pathname = '/admin.html';
  serve(path.join(root, decodeURIComponent(pathname)), res);
}).listen(port, '127.0.0.1', () => {
  console.log(`Local server running at http://localhost:${port}`);
  console.log(`CMS password: ${process.env.CMS_PASSWORD}`);
});
