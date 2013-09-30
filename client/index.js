// Define views and templates in the application here

// State variables
Session.set('myVideoSrc', '');
Session.set('inVideoChat', false);
Session.set('chattingWith', null);
Session.set('selectedRobot', null);
Session.set('selectedUser', null);
Session.set('status', '');
Session.set('connected', false);

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

Template.teleop.rendered = function() {
  $('#hidden_input').focus();
};

var key_pressed = null;

Template.teleop.events({
  'keydown input': function(evt) {
    if (!Session.get('connected')) return;
    console.log(evt.keyIdentifier);
    if (evt.keyCode == 37) { // left
      if (key_pressed != evt.keyCode) {
        Robot.left();
        key_pressed = evt.keyCode;
      }
    } else if (evt.keyCode == 38) { // up
      if (key_pressed != evt.keyCode) {
        Robot.forward();
        key_pressed = evt.keyCode;
      }
    } else if (evt.keyCode == 39) { // right
      if (key_pressed != evt.keyCode) {
        console.log('sending robot right');
        Robot.right();
        key_pressed = evt.keyCode;
      }
    } else if (evt.keyCode == 40) { // down
      if (key_pressed != evt.keyCode) {
        Robot.back();
        key_pressed = evt.keyCode;
      }
    }
  },
  'keyup input': function(evt) {
    if (!Session.get('connected')) return;
    console.log('key released', evt.keyIdentifier);
    Robot.stop_moving();
    key_pressed = null;
  },
  'mousedown #forward': function() {
    if (!Session.get('connected')) return;
    Robot.forward();
  },
  'mouseup': function() {
    if (!Session.get('connected')) return;
    console.log('End motion');
    Robot.stop_moving();
  },
  'mousedown #back': function() {
    if (!Session.get('connected')) return;
    Robot.back();
  },
  'mousedown #left': function() {
    if (!Session.get('connected')) return;
    Robot.left();
  },
  'mousedown #right': function() {
    if (!Session.get('connected')) return;
    Robot.right();
  }
});

Template.teleop.disabledState = function() {
  return Session.get("connected") ? "" : "disabled";
}

Template.connection.wspath = "ws://michelangelo:9099";
Template.connection.status = function() {
  return Session.get('status');
}

Template.connection.events({
  'click #connect': function() {
    ros = new ROSLIB.Ros();
    var host = $('#wspath').val();
    ros.connect(host);
    CMDVEL = new ROSLIB.Topic({
      'ros': ros,
      'name': '/cmd_vel_mux/input/teleop',
      'messageType': 'geometry_msgs/Twist'
      }
    );
    console.log('Connected to', host);
    Session.set('status', 'Connected to ' + host);
    Session.set('connected', true);
  }
});

/* Enable gamepad */

var joystick_motion = null;
function cb(gamepad) {
  if (!Session.get('connected')) return;

  if (gamepad.buttons[5]) {
    // gamepad.axes[3] is left/right
    // gamepad.axes[4] is up/down

    console.log('Motion activated', gamepad.axes[3], gamepad.axes[4]);
    var x = gamepad.axes[3];
    var y = gamepad.axes[4];
    if (x < -0.5) {
      if (joystick_motion != 'left') {
        Robot.stop_moving();
        Robot.left();
        joystick_motion = 'left';
      }
    } else if (x > 0.5) {
      if (joystick_motion != 'right') {
        Robot.stop_moving();
        Robot.right();
        joystick_motion = 'right';
      }
    } else if (y > 0.5) {
      if (joystick_motion != 'back') {
        Robot.stop_moving();
        Robot.back();
        joystick_motion = 'back';
      }
    } else if (y < -0.5) {
      if (joystick_motion != 'forward') {
        Robot.stop_moving();
        Robot.forward();
        joystick_motion = 'forward';
      }
    }
  } else {
    console.log('Motion stopped');
    joystick_motion = null;
    Robot.stop_moving();
  }
}
GamepadSupport.init(cb);
