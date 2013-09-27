// Define collections here that will be used on both client and server

// Try to create a new Meteor collection to communicate teleop
// values to/from the server

Teleop = new Meteor.Collection('teleop', {
  'up': false,
  'down': false,
  'left': false,
  'right': false
  });
