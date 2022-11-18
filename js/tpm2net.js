var dgram = require('dgram');
const head = Buffer.from([0x9c, 0xda, 0x03, 0x84, 0x01, 0x01]);
const tail = Buffer.from([0x36]);

function TPM2net(host, port) {
	console.log('TPM2net messages will be sent to ' + host +':'+ port);
    this.host = host;
    this.port = port;

    this.send = function(data) {

		if(data.length <= 1490)
		{
			const buf = Buffer.from(data);
			var client = dgram.createSocket('udp4');
			var length = head.length + buf.length + tail.length;
			client.send(Buffer.concat([head, buf, tail], length), 0, length, this.port, this.host, function(err, bytes) {
				if (err) throw err;
				client.close();
			});
		}
    }
};

module.exports = TPM2net;
