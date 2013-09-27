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

Template.teleop.events({
  'mousedown #up': function() {
    console.log('Start up');
  },
  'mouseup #up': function() {
    console.log('End up');
  },
  'mousedown #down': function() {
    console.log('Start down');
  },
  'mouseup #down': function() {
    console.log('End down');
  },
  'mousedown #left': function() {
    console.log('Start left');
  },
  'mouseup #left': function() {
    console.log('End left');
  },
  'mousedown #right': function() {
    console.log('Start right');
  },
  'mouseup #right': function() {
    console.log('End right');
  },
});
