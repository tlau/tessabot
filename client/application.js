// Define your main application here

// Subscribe to collections

// This subscription populates Meteor.users with all users published by the server
Meteor.subscribe('users');

function cb(gamepad) {
  if (gamepad.buttons[5]) {
    // gamepad.axes[3] is left/right
    // gamepad.axes[4] is up/down
    console.log('Motion activated', gamepad.axes[3], gamepad.axes[4]);
  } else {
    console.log('Motion stopped');
  }
}

GamepadSupport.init(cb);

var ros = new ROSLIB.Ros();
ros.connect('ws://192.168.2.107:9090/');
CMDVEL = new ROSLIB.Topic({
  'ros': ros,
  'name': '/cmd_vel',
  'messageType': 'geometry_msgs/Twist'
  }
);

