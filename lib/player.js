/* global Promise */
(function (module) {
  var abc = require('./abc');
  var midi = require('midi');

  const DEFAULT_DURATION = 500;

  // Create and init midi connexion.
  var output = new midi.output();
  output.openPort(1);

  // Init module.
  var player = {
    intruments: {
      piano: 0,
      organ: 19
    }
  };

  /**
   * Change output instrument.
   *
   * @param {int} code
   *   See player.instruments for some codes.
   */
  player.switch = function (code) {
    output.sendMessage([196, code]);
  };

  /**
   * Play a note.
   *
   * @param {int} note
   *   The note code (between 36 and 96)
   * @param {int} duration
   *   The note duration in milliseconds.
   * @return {Promise}
   */
  player.note = function (note, duration) {
    return new Promise(function (resolve, reject) {
      output.sendMessage([147, note, 112]);
      output.sendMessage([148, note, 112]);

      setTimeout(function() {
        output.sendMessage([147, note, 0]);
        output.sendMessage([148, note, 0]);
        resolve();
      }, duration);
    });
  };

  /**
   * Play a sequence of notes.
   *
   * @param {array} sequence
   *   An array of notes, each one being an array which first element is the note
   *   code or the note ABC notation and the second (optional) the duration.
   * @return {Promise}
   */
  player.sequence = function(sequence) {
    var p;

    sequence.forEach(function(data) {
      var note = isNaN(data[0]) ? abc.parse(data[0])[0] : data[0];
      var duration = data[1] || DEFAULT_DURATION;
      if (p === undefined) {
        p = player.note(note, duration);
      }
      else {
        p = p.then(player.note.bind(null, note, duration));
      }
    });

    return p;
  };

  /**
   * Destructor. Close midi ports.
   */
  player.halt = function () {
    output.closePort();
  };

  module.exports = player;
})(module);
