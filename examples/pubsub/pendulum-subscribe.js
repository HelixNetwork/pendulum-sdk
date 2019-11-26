// test push
const zmq = require('zeromq')
  , sock = zmq.socket('sub');
const provider = 'tcp://zmq.hlxtest.net:5556'
// receiver address, that you want to listen for, please specify this.
let receiver = "0000000000000000000000000000000000000000000000000000000000000000";
const Converter = require("@helixnetwork/converter");

sock.connect(provider);
sock.subscribe(receiver);

// you can subscribe to further topics, by adding sock.subscribe(<topic>)
// topics can be found here: https://github.com/HelixNetwork/pendulum#messageq
// sock.subscribce(<topic>);

console.log('Subscriber connected to: ' + provider);
sock.on('message', function(message) {
  // first message.toString().split(" ")[0] is the topic,
  // which is the receiver address in this case
  let msg = message.toString().split(" ")[1];
  let signFragment = JSON.parse(msg).signature;
  let asciiMsg = Converter.txsToAscii(signFragment);
  console.log(`received message: ${asciiMsg}`);
});
