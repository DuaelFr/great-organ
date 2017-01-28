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
    keepAlive: null
  };

  /**
   * Get current state data.
   *
   * @return {array}
   */
  function getCurrentState() {
    return GreatOrgan.states[GreatOrgan.currentState];
  }

  /**
   * Change the current state and play the associated sequence.
   * @param state
   */
  function changeState(state) {
    clearTimeout(GreatOrgan.timer);

    GreatOrgan.currentState = state;

    player.switch(player.intruments[getCurrentState().instrument]);
    interpreter.setSequences(GreatOrgan.sequences);
    playCurrentSequence();
  }

  /**
   * Play the current state sequence.
   */
  function playCurrentSequence() {
    var stateData = getCurrentState();
    player.sequence(GreatOrgan.sequences[stateData.sequence]);
    GreatOrgan.timer = setTimeout(playCurrentSequence, stateData.tempo);
  }

  /**
   * Reset current state sequence timer.
   */
  function resetTimer() {
    clearTimeout(GreatOrgan.timer);
    GreatOrgan.timer = setTimeout(playCurrentSequence, getCurrentState().tempo);
  }

  /**
   * Main method. Initialize the GreatOrgan and keep it alive.
   */
  GreatOrgan.run = function () {
    // Reset timer on note input.
    listener.on('note', resetTimer);
    // Try to interpret inputted notes.
    listener.on('note', interpreter.inputNote);
    interpreter.on('success', function (sequence) { console.log('YOUPI! ' + sequence); });
    interpreter.on('error', function (stack) { console.log('LOOSER! ' + stack); });

    changeState(GreatOrgan.currentState);
    setTimeout(changeState.bind(null, 'maintenance'), 15000);

    // Wait infinitely.
    (function wait() { GreatOrgan.keepAlive = setTimeout(wait, 1000); })(0);
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
