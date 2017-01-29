(function (module) {

  var listener = require('./listener');
  var interpreter = require('./interpreter');
  var player = require('./player');

  // Init module.
  var GreatOrgan = {
    states: require('../config/states.json'),
    sequences: require('../config/sequences.json'),
    currentState: 'waiting',
    timer: null,
    keepAlive: null,
    errorCount: 0
  };

  /**
   * Get current state data.
   *
   * @return {array}
   */
  GreatOrgan.getCurrentState = function () {
    return GreatOrgan.states[GreatOrgan.currentState];
  };

  /**
   * Change the current state and play the associated sequence.
   * @param state
   */
  GreatOrgan.changeState = function (state) {
    clearTimeout(GreatOrgan.timer);
    GreatOrgan.currentState = state;

    var currentState = GreatOrgan.getCurrentState();

    var stateSequences = {};
    for (var sequence in currentState.transitions) {
      stateSequences[sequence] = GreatOrgan.sequences[sequence];
    }
    interpreter.setSequences(stateSequences);

    player.switch(player.intruments[currentState.instrument]);
    GreatOrgan.playCurrentSequence();
  };

  /**
   * Play the current state sequence.
   */
  GreatOrgan.playSequence = function (sequence) {
    player.sequence(GreatOrgan.sequences[sequence]);
  };

  /**
   * Play the current state sequence.
   */
  GreatOrgan.playCurrentSequence = function () {
    var stateData = GreatOrgan.getCurrentState();
    GreatOrgan.playSequence(stateData.sequence);
    GreatOrgan.timer = setTimeout(GreatOrgan.playCurrentSequence, stateData.tempo);
  };


  /**
   * Reset current state sequence timer.
   */
  GreatOrgan.resetTimer = function () {
    clearTimeout(GreatOrgan.timer);
    GreatOrgan.timer = setTimeout(GreatOrgan.playCurrentSequence, GreatOrgan.getCurrentState().tempo);
  };

  /**
   * Main method. Initialize the GreatOrgan and keep it alive.
   */
  GreatOrgan.run = function () {
    // Reset timer on note input.
    listener.on('note', GreatOrgan.resetTimer);
    // Try to interpret inputted notes.
    listener.on('note', interpreter.inputNote);
    interpreter.on('success', GreatOrgan.onSuccess);
    interpreter.on('error', GreatOrgan.onError);

    GreatOrgan.changeState(GreatOrgan.currentState);

    // Wait infinitely.
    (function wait() { GreatOrgan.keepAlive = setTimeout(wait, 1000); })(0);
  };

  /**
   * A sequence has been inputted successfully.
   * @param sequence
   */
  GreatOrgan.onSuccess = function (sequence) {
    var transitions = GreatOrgan.getCurrentState().transitions[sequence];
    function callTransition (callback, arguments) {
      GreatOrgan[callback].apply(null, arguments);
    }
    for (var i in transitions) {
      setTimeout(callTransition.bind(null, transitions[i].callback, transitions[i].arguments), transitions[i].delay);
    }
  };

  /**
   * The user made an error inputing a sequence.
   * @param {string} stack
   */
  GreatOrgan.onError = function (stack) {
    GreatOrgan.errorCount++;
    if (GreatOrgan.errorCount == 10) {
      GreatOrgan.errorCount = 0;
      GreatOrgan.resetTimer();
      GreatOrgan.playSequence('beth');
    }
  };


  /**
   * Stop the GreatOrgan.
   */
  GreatOrgan.halt = function () {
    clearTimeout(GreatOrgan.keepAlive);
    player.halt();
    listener.halt();
    process.exit();
  };

  module.exports = GreatOrgan;

})(module);
