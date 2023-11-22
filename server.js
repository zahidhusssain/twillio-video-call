const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
//const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
server.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});