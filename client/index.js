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

var Robot = {
  forward: function() {
    $('#forward').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('FORWARD');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': 0, 'y': 0.5, 'z': 0 },
        'angular': { 'x': 0, 'y': 0, 'z': 0 }
      });
      CMDVEL.publish(msg);
    }, 250);
  },

  back : function() {
    $('#back').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('BACK');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': 0, 'y': -0.5, 'z': 0 },
        'angular': { 'x': 0, 'y': 0, 'z': 0 }
      });
      CMDVEL.publish(msg);
    }, 250);
  },

  left: function() {
    $('#left').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('LEFT');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': 0, 'y': 0, 'z': 0 },
        'angular': { 'x': -0.5, 'y': 0, 'z': 0 }
      });
      CMDVEL.publish(msg);
    }, 250);
  },

  right: function() {
    $('#right').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('RIGHT');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': 0, 'y': 0, 'z': 0 },
        'angular': { 'x': 0.5, 'y': 0, 'z': 0 }
      });
      CMDVEL.publish(msg);
    }, 250);
  },

  stop_moving: function() {
    if (teleop_cb) {
      window.clearInterval(teleop_cb);
      teleop_cb = null;
    }
    $('#forward').removeClass('alert');
    $('#back').removeClass('alert');
    $('#left').removeClass('alert');
    $('#right').removeClass('alert');
  }
};

Template.teleop.events({
  'mousedown #forward': function() {
    Robot.forward();
  },
  'mouseup': function() {
    console.log('End motion');
    Robot.stop_moving();
  },
  'mousedown #back': function() {
    Robot.back();
  },
  'mousedown #left': function() {
    Robot.left();
  },
  'mousedown #right': function() {
    Robot.right();
  }
});
