// Define your main application here

// Subscribe to collections

// This subscription populates Meteor.users with all users published by the server
//Meteor.subscribe('users');

Meteor.subscribe('teleop');

var ws = new WebSocket('ws://localhost:9099');
