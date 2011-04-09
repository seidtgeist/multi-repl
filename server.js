var fs = require('fs');
var http = require('http');
var io = require('socket.io');
var spawn = require('child_process').spawn;
var tty = require('./fixed_tty');
var url = require('url');

var routes = {
	'/':
	  [200, 'text/html', fs.readFileSync('client.html', 'utf8')],
	'/dojo.js':
	  [200, 'application/json', fs.readFileSync('dojo.js', 'utf8')],
	'/socket.io.min.js':
	  [200, 'application/json', fs.readFileSync('socket.io.min.js', 'utf8')],
	'/touch-icon-iphone.png':
	  [200, 'image/png', fs.readFileSync('touch-icon-iphone.png')],
	'/touch-icon-ipad.png':
	  [200, 'image/png', fs.readFileSync('touch-icon-ipad.png')],
	'/touch-icon-iphone4.png':
	  [200, 'image/png', fs.readFileSync('touch-icon-iphone4.png')],
	not_found:
	  [404, 'text/plain', 'Not found.']
};

var server = http.createServer(function(req, res){
	req.setEncoding('utf8');
	var path = url.parse(req.url).pathname;
	var route = routes[path] || routes.not_found;
	res.writeHead(route[0], { 'Content-Type': route[1] });
	res.end(route[2]);
});

server.listen(1337, '0.0.0.0');

var tty_handle = tty.open('bash');
var stream = tty_handle[0];
var repl = tty_handle[1];

repl.on('exit', function(){
	console.log('repl died');
});

var socket = io.listen(server, {});

var buffer = ''; // how not to do a buffer.

stream.setEncoding('utf8');
stream.on('data', function(data){
	buffer += data;
	socket.broadcast(data);
});

socket.on('connection', function(client){
	client.send(buffer);
	client.send('ohai!');
	client.on('message', function(message){
		stream.write(message + '\n');
	});
});
