/**
 * client/net/loader.js
 *
 * Handle ordered client loading of libraries
 *
 * @author Trevossdwwwwsss
 */

// TODO order!!

var scripts = [
	// libraries
	"three.min.js", "MTLLoader.js", "OBJMTLLoader.js", "stats.min.js",
	"jquery.js", "jquery-ui.js", 

	// objects 
	"player.js", "worldstate.js", "critter.js", "environment.js",
	
	// TODO IDK what this is for...
	//"ThreeOctree.js",

	// networking 
	"ControlsEvent.js", "connection.js", 

	// controls
	"controls.js", "keyboard.js", "mouse.js", "screen.js", "THREEx.FullScreen.js", 
	"PointerLockControls.js", 

	// shaders
	"vacuum.js",

	// gui
	"minimap.js", "options.js", "notifications.js", "status.js",

	// this defines main()
	"main.js"
];

var models = {
	player : [null, null],
	critters : [null],
	environment : [null, null],
	foods : []
};

// entries are structured: [our name, obj, mtl, scale]
var modelFiles = {
	player : [
		['Default player', 'yellow_boy_standing.obj', 'yellow_boy_standing.mtl', 0.04]
	],
	critters : [
		['Default critter', 'bunnyv2.obj', 'bunnyv2.mtl', 0.1]
	],
	environment : [
		['Blank room', 'blankRoom.obj', 'blankRoom.mtl', 1.],
		['Default room', 'roomWithWindows.obj', 'roomWithWindows.mtl', 1.]
	],
	foods : [
	]
};

/**
 * appends script elements to the DOM
 * @param scripts - a list/object
 * @param doc - the document global
 */
function loadScripts(scripts, doc) {
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
		loadModels();
		//attemptStart();
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

/**
 * loads all the .obj and .mtl files for players, critter, environments, etc.
 */
function loadModels() {
	// stupid javascript
	function loadFunc(type, index) {
		return function(evt) {
			var object = evt.content;
			var scale = modelFiles[type][index][3];
			object.scale.set(scale, scale, scale);
			models[type][index] = object;
			console.log("%s loaded %d/%d.", type, index+1, modelFiles[type].length);
			attemptStart();
		};
	}
	console.log("Loading models");
	for (var type in modelFiles) {
		for (var i = 0; i < modelFiles[type].length; i++) {
			var loader = new THREE.OBJMTLLoader();
			loader.addEventListener( 'load', loadFunc(type, i) );
			loader.load( modelFiles[type][i][1], modelFiles[type][i][2] );
		}
	}
}

/**
 * Guarantees all models and scripts are loaded before starting main
 */
var attempts = 0, attemptsNeeded = 4;
function attemptStart() {
	attempts++;
	if (attempts == attemptsNeeded) {
		console.log("Enough loading, time to play!");
		main();
	}
}
