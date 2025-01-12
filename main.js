import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('listening', function() {
	console.log('Server started on port %d', wss.options.port);
});

wss.on('connection', function connection(ws) {
	ws.on('error', console.error);

	ws.on('message', function message(data, isBinary) {
		if (isBinary) {
			console.log('received binary data from %s, discarding', ws._socket.remoteAddress);
			return;
		}
		console.log('received "%s" from %s', data, ws._socket.remoteAddress);
		wss.clients.forEach(function(client) {
			let data_str = `${data}`;
			let echo_request = data_str.toLowerCase().startsWith("echo ");
			if (echo_request) {
				data_str = data_str.substring(4);
			}
			if ((client !== ws && client.readyState === WebSocket.OPEN) || echo_request) {
				client.send(data_str);
			}
		});
	});

	ws.send('connected');
});
