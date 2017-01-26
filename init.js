
var GreatOrgan = require('./lib/go');
GreatOrgan.run();

// Temporary: halt the organ after 30 seconds.
// Todo replace by a halt sequence
setTimeout(GreatOrgan.halt, 30000);
