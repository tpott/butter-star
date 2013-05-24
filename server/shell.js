/**
 * shell.js
 * @fileoverview Provide admin shell h4ck$
 * @author Trevor Pottinger
 */

var repl = require('repl');

function Shell() {
	// nulls cause it to use defaults
	// trues are for: 
	//   uses global, default doesn't
	//   ignores undefined, default doesn't
	// TODO http://nodejs.org/api/repl.html#repl_repl_start_options
	//    the above documentation is WRONG. the parameters
	//    are not taken in the order they claim to be. possible 
	//    cause: out-of-date version of node :'(
	var loop = repl.start("dusty> ", null, null, null, true, 
			null, true, true, null);
}

module.exports = Shell;
