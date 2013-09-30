var teleop_cb = null;

Robot = {
  forward: function() {
    $('#forward').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('SENDING FORWARD TWIST');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': 0.2, 'y': 0, 'z': 0 },
        'angular': { 'x': 0, 'y': 0, 'z': 0 }
      });
      CMDVEL.publish(msg);
    }, 250);
  },

  back : function() {
    $('#back').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('SENDING BACK TWIST');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': -0.2, 'y': 0, 'z': 0 },
        'angular': { 'x': 0, 'y': 0, 'z': 0 }
      });
      CMDVEL.publish(msg);
    }, 250);
  },

  left: function() {
    $('#left').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('SENDING LEFT TWIST');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': 0, 'y': 0, 'z': 0 },
        'angular': { 'x': 0, 'y': 0, 'z': 1 }
      });
      CMDVEL.publish(msg);
    }, 250);
  },

  right: function() {
    $('#right').addClass('alert');
    teleop_cb = window.setInterval(function() {
      console.log('SENDING RIGHT TWIST');
      // Send a Twist message to the robot
      var msg = new ROSLIB.Message({
        'linear': { 'x': 0, 'y': 0, 'z': 0 },
        'angular': { 'x': 0, 'y': 0, 'z': -1 }
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

