// Define views and templates in the application here

// State variables
Session.set('myVideoSrc', '');
Session.set('inVideoChat', false);
Session.set('chattingWith', null);
Session.set('selectedRobot', null);
Session.set('selectedUser', null);

/* The Video template */

Template.video.events({
  'mouseup #startVideo': function() {
    var tag = $('#startVideo');
    // Ignore clicks if we are disabled
    if (tag.hasClass('disabled')) return;
    startVideoChat();
  }
});

Template.video.inVideoChat = function() {
  return Session.get('inVideoChat') ? 'videochat-show' : 'videochat-hide';
};
Template.video.events({
  'mouseup #endVideo': function() {
    endVideoChat();
    console.log('setting inVideoChat to false');
    Session.set('inVideoChat', false);
  },

  // TODO: support keyboard nav
  'keyup': function(ev) {
    console.log('key pressed:', ev);
  }
});
Template.video.myVideoSrc = function() {
  console.log('Returning myVideoSrc:', Session.get('myVideoSrc'));
  return Session.get('myVideoSrc');
};

/* Teleop functionality */

var teleop_cb = null;

Template.teleop.events({
  'mousedown #up': function() {
    teleop_cb = window.setInterval(function() {
      console.log('UP');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': {
          'x': 0,
          'y': 0.5,
          'z': 0
        },
        'angular': {
          'x': 0,
          'y': 0,
          'z': 0
        }
      });

      CMDVEL.publish(msg);
    }, 250);

  },
  'mouseup': function() {
    console.log('End motion');
    if (teleop_cb) {
      window.clearInterval(teleop_cb);
      teleop_cb = null;
    }
  },
  'mousedown #down': function() {
    teleop_cb = window.setInterval(function() {
      console.log('DOWN');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': {
          'x': 0,
          'y': -0.5,
          'z': 0
        },
        'angular': {
          'x': 0,
          'y': 0,
          'z': 0
        }
      });

      CMDVEL.publish(msg);
    }, 250);
  },
  'mousedown #left': function() {
    teleop_cb = window.setInterval(function() {
      console.log('LEFT');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': {
          'x': 0,
          'y': 0,
          'z': 0
        },
        'angular': {
          'x': -0.5,
          'y': 0,
          'z': 0
        }
      });

      CMDVEL.publish(msg);
    }, 250);
  },
  'mousedown #right': function() {
    teleop_cb = window.setInterval(function() {
      console.log('RIGHT');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': {
          'x': 0,
          'y': 0,
          'z': 0
        },
        'angular': {
          'x': 0.5,
          'y': 0,
          'z': 0
        }
      });

      CMDVEL.publish(msg);
    }, 250);
  }
});
