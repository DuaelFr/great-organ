// See http://anamnese.online.fr/abc/guide_abc.txt

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

var abc = {};

/**
 * Convert a string into an array of midi notes.
 *
 * @param partition
 * @return array
 */
abc.parse = function (partition) {
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
    if (partition[i+1] == '^') {
      note++;
    }
    // Flat.
    if (partition[i+1] == '_') {
      note--;
    }
    // If not the first octave.
    if (partition[i+1] != ',') {
      note += 12;
    }
    // If not the first or second octave.
    if (partition[i] == partition[i].toLowerCase()) {
      note += 12;
    }
    // If last octave.
    if (partition[i+1] == "'") {
      note += 12;
    }

    notes.push(note);
  }

  return notes;
};

module.exports = abc;
