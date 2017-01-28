(function (module) {

  var listen = require('./listen');
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
  // Reset timer on note input.
  listen.onNote.push(resetTimer);

  /**
   * Main method. Initialize the GreatOrgan and keep it alive.
   */
  GreatOrgan.run = function () {
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
    listen.halt();
    process.exit();
  };

  module.exports = GreatOrgan;

})(module);
