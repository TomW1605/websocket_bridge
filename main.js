import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('listening', function() {
	console.log('Server started on port %d', wss.options.port);
});

wss.on('connection', function connection(ws) {
	ws.on('error', console.error);

	ws.on('message', function message(data, isBinary) {
		let remoteAddress = ws._socket.remoteAddress.replace("::ffff:", "");
		if (isBinary) {
			console.log('received binary data from %s:%i, discarding', remoteAddress, ws._socket.remotePort);
			return;
		}
		console.log('received "%s" from %s:%i', data, remoteAddress, ws._socket.remotePort);
		wss.clients.forEach(function(client) {
			let data_str = `${data}`;
			let echo_request = data_str.toLowerCase().startsWith("echo ");
			if (echo_request) {
				data_str = data_str.substring(5);
			}
			if ((client !== ws && client.readyState === WebSocket.OPEN) || echo_request) {
				client.send(data_str);
				console.log('sent "%s" to %s:%i', data_str, client._socket.remoteAddress.replace("::ffff:", ""), client._socket.remotePort);
			}
		});
	});

	ws.send('connected');
});
