
var play = require('./lib/play');

// Switch output to organ.
play.switch(play.intruments.organ);

// Play intro.
function intro() {
  var sequence = [
    ['d', 400],
    ['e', 400],
    ['c', 400],
    ['C', 800],
    ['G', 800]
  ];
  play.sequence(sequence);
  setTimeout(intro, 5000);
}
intro();

// Wait infinitely.
console.info('Use CTRL-C to quit.');
(function wait(n) { n = (n+1)%999999; setTimeout(wait.bind(null, n), 1000); })(0);
