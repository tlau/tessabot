// Define your main application here

// Subscribe to collections

// This subscription populates Meteor.users with all users published by the server
//Meteor.subscribe('users');

Meteor.subscribe('teleop');

var ros = new ROSLIB.Ros();
ros.connect('ws://192.168.2.107:9090/');
CMDVEL = new ROSLIB.Topic({
  'ros': ros,
  'name': '/cmd_vel',
  'messageType': 'geometry_msgs/Twist'
  }
);

