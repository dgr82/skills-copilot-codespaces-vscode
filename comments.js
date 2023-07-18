// Create web server application to handle comments

// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var path = require('path');
var comments = require('./comments.json');

// Configure application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Create HTTP server
var server = require('http').createServer(app);

// Create socket server
var io = require('socket.io')(server);

// Listen for connections
io.on('connection', function (client) {
  console.log('Client connected...');

  // Send all comments to new client
  client.emit('comments', comments);

  // Listen for new comments
  client.on('comment', function (data) {

    // Add comment to comments array
    comments.push(data);

    // Write comments array to comments.json
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function (err) {
      console.log(err);
    });

    // Broadcast new comment to all clients
    io.emit('comment', data);
  });
});

// Route for comments
app.get('/comments', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Start server
server.listen(8080);
console.log('Listening on port 8080...');
