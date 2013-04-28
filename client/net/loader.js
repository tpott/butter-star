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

	// controls
	"controls.js", "keyboard.js", "mouse.js", "screen.js", "THREEx.FullScreen.js", 
	"PointerLockControls.js", 

	// networking 
	"ControlsEvent.js", "connection.js", 

	// effects
	"vacuum.js",

	// objects (+ models?) - TODO trevor, include models in objects
	"player.js", "worldstate.js", 
	
	// TODO IDK what this is for...
	"ThreeOctree.js" 
];

// TODO order!!

/**
 * appends script elements to the DOM
 * @param scripts - a list/object
 */
function loadAll(scripts) {
	var head = document.getElementsByTagName('head')[0];
	singleLoader(scripts, 0, head);
}

/**
 * Appends a single script at a time
 * scripts - a list of script URLs
 * index - the position in list, must be used as key to scripts
 * head - the DOM element to be appended to
 */
function singleLoader(scripts, index, head) {
	// stop recurrance
	if (index >= scripts.length)
		return;

	// create the new DOM script element from the url
	var script = document.createElement('script')
		.setAttribute('src', scripts[index])
		.setAttribute('type', 'text/javascript'); // TODO determine actual type

	// load next file!
	script.onload = function() {
		singleLoader(scripts, index+1, head);
	};

	head.appendChild(script);
}
