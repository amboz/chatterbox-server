//importing url module to refer to url parser to extract pieces of URL
const url = require('url');
//importing querystring module to parse querystring during POST into object
const querystring = require('querystring');

//below is our "db"
const responseBody = {results: []};
let objectId = 1;
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  //store parsed url and pathname
  const parsedUrl = url.parse(request.url);
  const pathname = parsedUrl.pathname;
  const headers = defaultCorsHeaders;

  //handle GET, POST requests and default
  if (request.method === 'GET' && pathname === '/classes/messages') {
    const statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(responseBody));
  } else if (request.method === 'POST' && pathname === '/classes/messages') {
    const statusCode = 201;
    // headers['Content-Type'] = 'application/json';
    //need to write changes to our results array with POST request
    //create body string with each chunk
    //writeHead and end on 'end' to ensure all data is processed (handle async nature of POST request)
    let body = '';
    request.on('data', (chunk) => {
      //collect entire request body
      console.log(chunk);
      body += chunk;
    });
    request.on('end', () => {
      console.log(body);
      //update the "db" with parsed data
      // responseBody.results.push(querystring.parse(body));
      let obj = JSON.parse(body);
      obj.objectId = objectId++;
      responseBody.results.push(obj);
      console.log(responseBody.results);
      response.writeHead(statusCode, headers);
      //end the request
      response.end('{"success": "hell yeag"}');
      // response.end();
    });
  } else if (request.method === 'OPTIONS') {
    const statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  } else {
    const statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }

};

exports.requestHandler = requestHandler;


  // // The outgoing status.
  // var statusCode = 200;

  // // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // // Tell the client we are sending them plain text.
  // //
  // // You will need to change this if you are sending something
  // // other than plain text, like JSON or HTML.

  // headers['Content-Type'] = 'text/plain';

  // // .writeHead() writes to the request line and headers of the response,
  // // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // // Make sure to always call response.end() - Node may not send
  // // anything back to the client until you do. The string you pass to
  // // response.end() will be the body of the response - i.e. what shows
  // // up in the browser.
  // //
  // // Calling .end "flushes" the response's internal buffer, forcing
  // // node to actually send all the data over to the client.
  // response.end(JSON.stringify(responseBody));

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };

