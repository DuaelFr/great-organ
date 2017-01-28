(function (module) {
  var midi = require('midi');

  // Create and init midi connexion.
  var input = new midi.input();
  input.openPort(1);

  // Init module.
  var listener = {
    onNote: []
  };

  /**
   * Listen midi inputs and react to them.
   *
   * @param {int} deltaTime
   * @param {int[]} message
   */
  listener.handleInput = function (deltaTime, message) {
    // When a note is pressed run all onNote callbacks.
    if (message[0] == 147 && message[2] == 112) {
      listener.onNote.forEach(function (callback) {
        callback(message[1]);
      });
    }
  };
  input.on('message', listener.handleInput);

  /**
   * Destructor. Close midi ports.
   */
  listener.halt = function () {
    input.closePort();
  };

  module.exports = listener;

})(module);
