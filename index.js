var net = require('net');

var port = 6555;
var host = "localhost";
var data = {};

module.exports.createConnection = function () {
	var dataStream = net.createConnection(port, host);
	dataStream.write(JSON.stringify({
		"values": {
			"push": true,
			"version": 1,
		},
		"category": "tracker",
		"request": "set"
	}));

	dataStream.on('data', (message) => {
		//message = message.toString();
		var oldData = data;
		try {
			data = JSON.parse(message);
			//message.substr(0, message.length-1));
		} catch(e) {
			data = oldData;
		}
	})

	var heartbeat = setInterval(() => {
		dataStream.write(JSON.stringify({
			"category": "heartbeat",
			"request": "null"
		}));
	}, 250);
}

module.exports.getCoordinates = function () {
	return { x: data['values']['frame']['avg']['x'],
			 y: data['values']['frame']['avg']['y'] };
}

module.exports.closeConnection = function () {
	clearInterval(heartbeat);
	dataStream.end();
}
