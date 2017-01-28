(function (module) {

  // Local variables.
  var EL = require('./event-listener');
  var midi = require('midi');

  var eventListener = new EL(['note']);
  var input = new midi.input();
  input.openPort(1);

  // Init module.
  var listener = {};

  /**
   * Listen midi inputs and react to them.
   *
   * @param {int} deltaTime
   * @param {int[]} message
   */
  listener.handleInput = function (deltaTime, message) {
    // When a note is pressed run all onNote callbacks.
    if (message[0] == 147 && message[2] == 112) {
      eventListener.trigger('note', message[1]);
    }
  };
  input.on('message', listener.handleInput);

  /**
   * Destructor. Close midi ports.
   */
  listener.halt = function () {
    input.closePort();
  };

  /**
   * {@inheritdoc}
   */
  listener.on = eventListener.on;

  module.exports = listener;

})(module);
