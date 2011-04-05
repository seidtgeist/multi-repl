var fs = require('fs');
var http = require('http');
var io = require('socket.io');
var spawn = require('child_process').spawn;
var url = require('url');

// make it work
// add connecting users into current repl
// add session & differnt repls, i.e.: /v8/$session_id
// put stuff into functions
// reorganize files

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
	res.end();
});
server.listen(1337, '0.0.0.0');

// kinda works: clj, irb, ipython
// doesnt work: v8, node, spidermonkey
// not tested: ghci
var repl = spawn('clj');
repl.stdout.setEncoding('utf8');
repl.stderr.setEncoding('utf8');
repl.on('exit', function(){
	console.log('repl died');
});
var socket = io.listen(server);

repl.stdout.on('data', function(data){
	socket.broadcast(data);
});

repl.stderr.on('data', function(data){
	// CAUTION, JUST THE EFFIN' ERROR HANDLER
	socket.broadcast(data);
});

socket.on('connection', function(client){
	client.on('message', function(message){
		repl.stdin.write(message + "\r\n");
	});
});
