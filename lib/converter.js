(function (module) {
  // See http://anamnese.online.fr/abc/guide_abc.txt
  // Custom addition: for the higher octave, use an exclamation mark (eg. f!)
  //                  for a silence, use a "x" note

  const START = 48;
  const NOTES = {
    x: 0, // silence
    c: 0, // do
    d: 2, // ré
    e: 4, // mi
    f: 5, // fa
    g: 7, // sol
    a: 9, // la
    b: 11 // si
  };

  var converter = {};

  /**
   * Convert an ABC string into an array of midi notes.
   *
   * @param {string} partition
   * @return {int[]}
   */
  converter.parseABC = function (partition) {
    var notes = [];

    var note;
    for (var i = 0; i < partition.length ; ++i) {
      // Avoid modifiers that have been managed by the previous step.
      if (NOTES[partition[i].toLowerCase()] === undefined) { continue; }

      if (partition[i] == 'x') {
        notes.push(0);
        continue;
      }

      // Init the note value.
      note = START;

      // Jump to the right note.
      note += NOTES[partition[i].toLowerCase()];

      // If not the first or second octave.
      if (partition[i] == partition[i].toLowerCase()) {
        note += 12;
      }

      var jump = false;
      for (var j = 1 ; j < 3 && !jump ; ++j) {
        switch (partition[i+j]) {
          // Sharp.
          case '^':
            note++;
            break;

          // Flat.
          case '_':
            note--;
            break;

          // Very first octave.
          case ',':
            note -= 12;
            break;

          // Fourth octave.
          case "'":
            note += 12;
            break;

          // Fifth octave.
          case '!':
            note += 24;
            break;

          // Any of these.
          default:
            jump = true;
            break;
        }
      }

      notes.push(note);
    }

    return notes;
  };

  module.exports = converter;
})(module);
