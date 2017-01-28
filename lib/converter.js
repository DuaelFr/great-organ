(function (module) {
  // See http://anamnese.online.fr/abc/guide_abc.txt
  // Custom addition: for the higher octave, use an exclamation mark (eg. f!)

  const START = 36;
  const NOTES = {
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

      // Init the note value.
      note = START;

      // Jump to the right note.
      note += NOTES[partition[i].toLowerCase()];

      // Sharp.
      if (partition[i+1] == '^' || partition[i+2] == '^') {
        note++;
      }
      // Flat.
      if (partition[i+1] == '_' || partition[i+2] == '_') {
        note--;
      }
      // If not the first octave.
      if (partition[i+1] != ',' || partition[i+2] != ',') {
        note += 12;
      }
      // If not the first or second octave.
      if (partition[i] == partition[i].toLowerCase()) {
        note += 12;
      }
      // If last octave.
      if (partition[i+1] == "'" || partition[i+2] == "'") {
        note += 12;
      }
      // If higher octave.
      if (partition[i+1] == '!' || partition[i+1] == '!') {
        note += 24;
      }

      notes.push(note);
    }

    return notes;
  };

  module.exports = converter;
})(module);
