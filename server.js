var fs = require('fs');
var http = require('http');
var io = require('socket.io');
var spawn = require('child_process').spawn;
var tty = require('./fixed_tty');
var url = require('url');

var files = {
	client: fs.readFileSync('client.html', 'utf8'),
	dojo: fs.readFileSync('dojo.js', 'utf8'),
	socket_io: fs.readFileSync('socket.io.min.js', 'utf8')
};

var server = http.createServer(function(req, res){
	req.setEncoding('utf8');
	var path = url.parse(req.url).pathname;
	switch (path){
	case '/':
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(files.client);
	case '/dojo.js':
		res.writeHead(200, { 'Content-Type': 'application/javascript' });
		res.end(files.dojo);
	case '/socket.io.min.js':
		res.writeHead(200, { 'Content-Type': 'application/javascript' });
		res.end(files.socket_io);
	default:
		res.end('404');
	}
});

server.listen(1337, '127.0.0.1');

var tty_handle = tty.open('v8');
var stream = tty_handle[0];
var repl = tty_handle[1];

repl.on('exit', function(){
	console.log('repl died');
});

var socket = io.listen(server, { log: false });

var buffer = ''; // how not to do a buffer.

stream.setEncoding('utf8');
stream.on('data', function(data){
	buffer += data;
	socket.broadcast(data);
});

socket.on('connection', function(client){
	client.send(buffer);
	client.on('message', function(message){
		stream.write(message + '\n');
	});
});
