/**
 * @fileoverview Check that the client HTML and JS files are error-free
 * before creating a server.
 * @author Trevor Pottinger
 */

// External classes
var config = require('./../../config.js');
var fs = require('fs');
var Server = require('./server.js').Server;

// Used to check both files are error free.
var readCount = 0;

// Contents of the HTML and JS files.
var simpleHTML = "", simpleJS = "";

// Delay in milliseconds
var DELAY = 1000 / 60;

/**
 * Read both the HTML and client JS files and make sure they are both error
 * free before creating a server.
 */
fs.readFile(config.paths.html, 'utf8', function(err, data) {
	if (err) throw err;
	readCount++;
	simpleHTML = data;
	if (readCount == 2) {
      var server = new Server();
      server.start();
      setInterval(function(){server.updateAllClients();}, 1000/60);
  }
});

fs.readFile(config.paths.clientWS, 'utf8', function(err, data) {
	if (err) throw err;
	readCount++;
	simpleJS = data;
	if (readCount == 2) { 
      var server = new Server();
      server.start();
      setInterval(function(){server.updateAllClients();}, 1000/60);
  }
});
