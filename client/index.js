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

Template.teleop.rendered = function() {
  $('#hidden_input').focus();
};

var key_pressed = null;

Template.teleop.events({
  'keydown input': function(evt) {
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
    console.log('key released', evt.keyIdentifier);
    Robot.stop_moving();
    key_pressed = null;
  },
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
