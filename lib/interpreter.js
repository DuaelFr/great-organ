(function (module) {

  // Local variables.
  var converter = require('./converter');
  var EL = require('./event-listener');

  var eventListener = new EL(['success', 'error']);
  var stack = '';
  var index = {};

  // Init module.
  var interpreter = {};

  /**
   * Change interpreted sequences, rebuild index and reset stack.
   * @param {Object} sequences
   */
  interpreter.setSequences = function (sequences) {
    var note;
    for (var sequence in sequences) {
      if (sequences.hasOwnProperty(sequence)) {
        index[sequence] = '';
        for (var i in sequences[sequence]) {
          note = isNaN(sequences[sequence][i][0]) ? converter.parseABC(sequences[sequence][i][0]) : sequences[sequence][i][0];
          index[sequence] += '-' + note;
        }
      }
    }
    interpreter.reset();
  };

  /**
   * Add a note to the stack and check if it's part of a sequence.
   * @param {int} note
   */
  interpreter.inputNote = function (note) {
    stack += '-' + note;
    for (var sequence in index) {
      // If we find an exact match.
      if (stack == index[sequence]) {
        eventListener.trigger('success', sequence, stack);
        interpreter.reset();
        return;
      }
      // If we only find a matching start, just exit and wait for another input.
      else if (index[sequence].indexOf(stack) === 0) {
        return;
      }
    }

    // If the function didn't end before this, this is an error.
    eventListener.trigger('error', stack);
    interpreter.reset();
  };

  /**
   * Reset the notes stack.
   */
  interpreter.reset = function () {
    stack = '';
  };

  /**
   * {@inheritdoc}
   */
  interpreter.on = eventListener.on;

  module.exports = interpreter;

})(module);
