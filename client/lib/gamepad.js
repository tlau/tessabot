// Initialize joystick
// This comes from http://www.html5rocks.com/en/tutorials/doodles/gamepad/
GamepadSupport = {

  // A number of typical buttons recognized by Gamepad API and mapped to
  // standard controls. Any extraneous buttons will have larger indexes.
  TYPICAL_BUTTON_COUNT: 16,

  // A number of typical axes recognized by Gamepad API and mapped to
  // standard controls. Any extraneous buttons will have larger indexes.
  TYPICAL_AXIS_COUNT: 4,

  // Whether we’re requestAnimationFrameing like it’s 1999.
  ticking: false,

  // The canonical list of attached gamepads, without “holes” (always
  // starting at [0]) and unified between Firefox and Chrome.
  gamepads: [],

  // Remembers the connected gamepads at the last check; used in Chrome
  // to figure out when gamepads get connected or disconnected, since no
  // events are fired.
  prevRawGamepadTypes: [],

  // Previous timestamps for gamepad state; used in Chrome to not bother with
  // analyzing the polled data if nothing changed (timestamp is the same
  // as last time).
  prevTimestamps: [],

  // A callback to call when the values change
  // function(gamepad) {}
  callback: null,

  init: function(cb) {
    if (cb) {
      GamepadSupport.callback = cb;
    }

    var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads ||
      (navigator.userAgent.indexOf('Firefox/') != -1);
    
    if (!gamepadSupportAvailable) {
      console.log('Gamepad not supported');
    } else {
      window.addEventListener('MozGamepadConnected',
        GamepadSupport.onGamepadConnect, false);
      window.addEventListener('MozGamepadDisconnected',
        GamepadSupport.onGamepadDisconnect, false);

      if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
        GamepadSupport.startPolling();
      }
    }
  },

  /**
   * React to the gamepad being connected. Today, this will only be executed
   * on Firefox.
   */
  onGamepadConnect: function(event) {
    // Add the new gamepad on the list of gamepads to look after.
    GamepadSupport.gamepads.push(event.gamepad);

    // Ask the tester to update the screen to show more gamepads.
    tester.updateGamepads(GamepadSupport.gamepads);

    // Start the polling loop to monitor button changes.
    GamepadSupport.startPolling();
  },

  // This will only be executed on Firefox.
  onGamepadDisconnect: function(event) {
    // Remove the gamepad from the list of gamepads to monitor.
    for (var i in GamepadSupport.gamepads) {
      if (GamepadSupport.gamepads[i].index == event.gamepad.index) {
        GamepadSupport.gamepads.splice(i, 1);
        break;
      }
    }

    // If no gamepads are left, stop the polling loop.
    if (GamepadSupport.gamepads.length == 0) {
      GamepadSupport.stopPolling();
    }

    // Ask the tester to update the screen to remove the gamepad.
    tester.updateGamepads(GamepadSupport.gamepads);
  },

  /**
   * Starts a polling loop to check for gamepad state.
   */
  startPolling: function() {
    // Don’t accidentally start a second loop, man.
    if (!GamepadSupport.ticking) {
      GamepadSupport.ticking = true;
      GamepadSupport.tick();
    }
  },

  /**
   * Stops a polling loop by setting a flag which will prevent the next
   * requestAnimationFrame() from being scheduled.
   */
  stopPolling: function() {
    GamepadSupport.ticking = false;
  },


  /**
   * A function called with each requestAnimationFrame(). Polls the gamepad
   * status and schedules another poll.
   */
  tick: function() {
    GamepadSupport.pollStatus();
    GamepadSupport.scheduleNextTick();
  },

  scheduleNextTick: function() {
    // Only schedule the next frame if we haven’t decided to stop via
    // stopPolling() before.
    if (GamepadSupport.ticking) {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(GamepadSupport.tick);
      } else if (window.mozRequestAnimationFrame) {
        window.mozRequestAnimationFrame(GamepadSupport.tick);
      } else if (window.webkitRequestAnimationFrame) {
        window.webkitRequestAnimationFrame(GamepadSupport.tick);
      }
      // Note lack of setTimeout since all the browsers that support
      // Gamepad API are already supporting requestAnimationFrame().
    }
  },

  /**
   * Checks for the gamepad status. Monitors the necessary data and notices
   * the differences from previous state (buttons for Chrome/Firefox,
   * new connects/disconnects for Chrome). If differences are noticed, asks
   * to update the display accordingly. Should run as close to 60 frames per
   * second as possible.
   */
  pollStatus: function() {
    // Poll to see if gamepads are connected or disconnected. Necessary
    // only on Chrome.
    GamepadSupport.pollGamepads();

    for (var i in GamepadSupport.gamepads) {
      var gamepad = GamepadSupport.gamepads[i];

      // Don’t do anything if the current timestamp is the same as previous
      // one, which means that the state of the gamepad hasn’t changed.
      // This is only supported by Chrome right now, so the first check
      // makes sure we’re not doing anything if the timestamps are empty
      // or undefined.
      if (gamepad.timestamp &&
          (gamepad.timestamp == GamepadSupport.prevTimestamps[i])) {
        continue;
      }
      GamepadSupport.prevTimestamps[i] = gamepad.timestamp;

      if (GamepadSupport.callback) {
        GamepadSupport.callback(gamepad);
      }
    }
  },

  // This function is called only on Chrome, which does not yet support
  // connection/disconnection events, but requires you to monitor
  // an array for changes.
  pollGamepads: function() {

    // Get the array of gamepads – the first method (function call)
    // is the most modern one, the second is there for compatibility with
    // slightly older versions of Chrome, but it shouldn’t be necessary
    // for long.
    var rawGamepads =
        (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
        navigator.webkitGamepads;

    if (rawGamepads) {
      // We don’t want to use rawGamepads coming straight from the browser,
      // since it can have “holes” (e.g. if you plug two gamepads, and then
      // unplug the first one, the remaining one will be at index [1]).
      GamepadSupport.gamepads = [];

      // We only refresh the display when we detect some gamepads are new
      // or removed; we do it by comparing raw gamepad table entries to
      // “undefined.”
      var gamepadsChanged = false;

      for (var i = 0; i < rawGamepads.length; i++) {
        if (typeof rawGamepads[i] != GamepadSupport.prevRawGamepadTypes[i]) {
          gamepadsChanged = true;
          GamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
        }

        if (rawGamepads[i]) {
          GamepadSupport.gamepads.push(rawGamepads[i]);
        }
      }

      // Ask the tester to refresh the visual representations of gamepads
      // on the screen.
      if (gamepadsChanged) {
        // There is a new gamepad registered
      }
    }
  },

}


