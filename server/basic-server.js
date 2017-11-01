/* Import node's http module: */
//**Express does not need http**
// const http = require('http');
//Import express
const express = require('express');
//Import body-parser for easy request handling (will call app.use)
const bodyParser = require('body-parser');
//Import path module for creating absolute path to client dir
const path = require('path');
//Import fs module to write to local file
const fs = require('fs');
//Create client path (abs path to client); __dirname refers to current filepath
const publicPath = path.join(__dirname, '../client');
//assign result of express fxn to app
const app = express();
//below will give each request a body property
app.use(bodyParser.json());
//index.html is default in client dir
//call express.static to set a path for static files (html, css)
app.use(express.static(publicPath));

//require(...) is the same as exports; access prop on exports
//**Express does not need cb below**
// var handleRequest = require('./request-handler').requestHandler;

// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.

//below is our "db"
let responseBody = {results: []};
let objectId = 1;
const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

const port = 3000;

//return entire "db" for GET
app.get('/classes/messages', function(req, res) {
  //fs read, on file named stuff
  fs.readFile(__dirname + '/chat-records', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(JSON.parse(data));
    //must reassign "db" on each get request to handle cases...
    //...where server has closed/reopened and responseBody set to empty value
    responseBody = JSON.parse(data);
    res.status('200').header(defaultCorsHeaders).send(data);
  });
});

//append req to "db" for POST
app.post('/classes/messages', function(req, res) {
  let obj = req.body;
  // console.log(obj);
  obj.objectId = objectId++;
  responseBody.results.push(obj);
  //fs write; will overwrite current file
  fs.writeFile(__dirname + '/chat-records', JSON.stringify(responseBody), 'utf8', (err) => { 
    if (err) {
      console.log(err);
    }
    res.status('201').header(defaultCorsHeaders).send();
  });
});

//respond with options for OPTIONS
app.options('/classes/messages', function(req, res) {
  res.status('200').set(defaultCorsHeaders).send();
});
//app.use is a method that runs a callback
//would utilize next param if below is not at end of file (last thing we do)
app.use(function(req, res, next) {
  res.status('404').send('Not found');
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
//**Express does not need ip below**
// var ip = '127.0.0.1';



// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
//**Express does not need http**
// var server = http.createServer(handleRequest);
// console.log('Listening on http://' + ip + ':' + port);
// server.listen(port, ip);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

