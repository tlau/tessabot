Meteor.startup(function () {
  // code to run on server at startup

  // TODO: initialize roslibjs
  /*
  var ros = new ROSLIB.Ros();

  var hostname = 'localhost';
  ros.connect('ws://' + hostname + ':9099');
  ros.on('connection', function() {
    console.log('ROSLIB connected to ROS');
  });
  */

  var Zmq = Meteor.require('zmq');
  var sock = Zmq.socket('push');
  sock.bindSync('tcp://127.0.0.1:3010');
  console.log('Node server bound to port 3010');

  Teleop.on('message', function(msg) {
    console.log('Received message:', msg);
    // Turn around and send it to zmq
    sock.send(msg);
  });

});
