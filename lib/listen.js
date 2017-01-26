(function (module) {
  var midi = require('midi');

  // Create and init midi connexion.
  var input = new midi.input();
  input.openPort(1);

  // Init module.
  var listen = {
    onNote: []
  };

  /**
   * Listen midi inputs and react to them.
   *
   * @param {int} deltaTime
   * @param {int[]} message
   */
  listen.handleInput = function (deltaTime, message) {
    // When a note is pressed run all onNote callbacks.
    if (message[0] == 147) {
      listen.onNote.forEach(function (callback) {
        callback(message);
      });
    }
  };
  input.on('message', listen.handleInput);

  /**
   * Destructor. Close midi ports.
   */
  listen.halt = function () {
    input.closePort();
  };

  module.exports = listen;

})(module);
