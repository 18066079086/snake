const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const PUBLIC_DIR = path.join(__dirname, '.');

const server = http.createServer((req, res) => {
    // 获取请求的文件路径
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);

    // 确定文件类型
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    // 读取文件
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 找不到文件
                fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err, notFoundContent) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(notFoundContent, 'utf-8');
                });
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // 成功读取文件
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

console.log(`Starting server on port ${PORT}...`);