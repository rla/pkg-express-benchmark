const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const http = require('http');
const express = require('express');

// Generates a random string of the given length.
const randomString = (length) => {
    const buffer = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
        buffer.writeInt8(97 + Math.floor(Math.random() * 26), i);
    }
    return buffer.toString();
};

// Generates a random user object.
const randomUser = () => {
    return {
        name: randomString(10),
        email: randomString(8) + '@' + randomString(6) + '.com',
        phone: randomString(8),
        post_count: Math.floor(Math.random() * 100)
    };
};

// Generates random data for a page.
const randomData = () => {
    const users = [];
    for (let i = 0; i < 200; i++) {
        users.push(randomUser());
    }
    return { title: randomString(20), users };
};

const app = express();

// Set up EJS templating engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/handler', (req, res) => {
    res.render('index', randomData());
});

const httpServer = http.createServer();
httpServer.on('request', app);

httpServer.listen(8000, () => {
    console.log(`HTTP server is started.`);
});
