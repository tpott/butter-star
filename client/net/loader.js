/**
 * client/net/loader.js
 *
 * Handle ordered client loading of libraries
 *
 * @author Trevor
 */

var scripts = [
	// libraries
	"three.min.js", "MTLLoader.js", "OBJMTLLoader.js", "stats.min.js",
	"jquery.js",

	// objects (+ models?) - TODO trevor, include models in objects
	"player.js", "worldstate.js",
	
	// TODO IDK what this is for...
	//"ThreeOctree.js",

	// networking 
	"ControlsEvent.js", "connection.js", 

	// controls
	"controls.js", "keyboard.js", "mouse.js", "screen.js", "THREEx.FullScreen.js", 
	"PointerLockControls.js", 

	// effects
	"vacuum.js",

	// gui
	"minimap.js",

	// this defines main()
	"main.js"
];

// TODO order!!

/**
 * appends script elements to the DOM
 * @param scripts - a list/object
 * @param doc - the document global
 */
function loadAll(scripts, doc) {
	var head = doc.getElementsByTagName('head')[0];
	console.log('Loading ' + scripts);
	singleLoader(scripts, 0, doc, head);
}

/**
 * Appends a single script at a time
 * scripts - a list of script URLs
 * index - the position in list, must be used as key to scripts
 * head - the DOM element to be appended to
 */
function singleLoader(scripts, index, doc, head) {
	// stop recurrance
	if (index >= scripts.length) {
		main();
		//_lastFunc();
		return;
	}

	console.log('Loading "%s" %d/%d', scripts[index], index+1, scripts.length);

	// create the new DOM script element from the url
	var script = doc.createElement('script');
	script.setAttribute('src', scripts[index]);
	script.setAttribute('type', 'text/javascript'); // TODO determine actual type

	// load next file!
	script.onload = function() {
		singleLoader(scripts, index+1, doc, head);
	};

	head.appendChild(script);
}
