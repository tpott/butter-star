/**
 * client/net/loader.js
 *
 * Handle ordered client loading of libraries
 *
 * @author Trevossdwwwwsss
 */

var filesLoaded = 0; 
var SCRIPTS_NEEDED = 26,
	 MODELS_NEEDED = 5,
	 ANIMATIONS_NEEDED = 1,
	 SHADERS_NEEDED = 2;

// TODO order!!
var scripts = [
	// libraries
	["three.min.js", "text/javascript", null], 
	["MTLLoader.js", "text/javascript", null], // TODO is thisbeing used?
	["OBJMTLLoader.js", "text/javascript", null], 
	["stats.min.js", "text/javascript", null], 
	["jquery.js", "text/javascript", null], 
	["jquery-ui.js", "text/javascript", null], 
	["ColladaLoader.js", "text/javascript", null], 

	// objects 
	["player.js", "text/javascript", null], 
	["worldstate.js", "text/javascript", null], 
	["critter.js", "text/javascript", null], 
	["environment.js", "text/javascript", null], 
	
	// TODO IDK what this is for...
	//"ThreeOctree.js",

	// networking 
	["ControlsEvent.js", "text/javascript", null], 
	["connection.js", "text/javascript", null], 

	// controls
	["controls.js", "text/javascript", null], 
	["keyboard.js", "text/javascript", null], 
	["mouse.js", "text/javascript", null], 
	["screen.js", "text/javascript", null], 
	["THREEx.FullScreen.js", "text/javascript", null], 
	["PointerLockControls.js", "text/javascript", null], 

	// shaders
	["vacuum.js", "text/javascript", null], 
	["animate.js", "text/javascript", null],

	// gui
	["minimap.js", "text/javascript", null], 
	["options.js", "text/javascript", null], 
	["notifications.js", "text/javascript", null], 
	["status.js", "text/javascript", null], 

	// this defines main()
	["main.js", "text/javascript", null] 
];

// entries are structured: [model, model name, obj file, mtl file, scale]
var models = {
	players : [
		[null, 'Default player', 'boy.obj', 'boy.mtl', 0.04],
		[null, 'Yixin Cube', 'yixin_cube.obj', 'yixin_cube.mtl', 0.1]
	],
	critters : [
		[null, 'Default critter', 'boo.obj', 'boo.mtl', 0.4]
	],
	environments : [
		[null, 'Default room', 
			'roomWithWindows.obj', 'roomWithWindows.mtl', 1.],
		[null, 'Blank room', 'blankRoom.obj', 'blankRoom.mtl', 1.]
	],
	food : [
	]
};

var animations = {
	players : [
	],
	critters : [
		//[null, null, 'Bunny Kill', 'bunny_spin.dae', 0.2],
		[null, null, 'WebGL Monster', 'monster.dae', 0.005]
	],
	environments : [
	],
	foods : [
	]
};

var shaders = [
	["basic-vert.js", "x-shader/x-vertex", "vertexShader"],
	["basic-frag.js", "x-shader/x-fragment", "fragmentShader"]
];

function logger(doc, elem) {
	return function () {};
	// TODO
	return function log(str) {
		var text = doc.createTextNode(str + "\n");
		elem.appendChild(text);
	};
}

var log;

/**
 * appends script elements to the DOM
 * @param scripts - a list/object
 * @param doc - the document global
 */
function loadAll(doc) {
	var load_elem = doc.getElementById("loader");
	console.log(load_elem);
	log = logger(doc, load_elem);

	// scripts is a global defined in this file
	var head = doc.getElementsByTagName('head')[0];
	singleScriptLoader(scripts, 0, doc, head);
}

/**
 * Appends a single script at a time
 * scripts - a list of script URLs
 * index - the position in list, must be used as key to scripts
 * head - the DOM element to be appended to
 */
function singleScriptLoader(scripts, index, doc, head) {
	// stop recurrance
	if (index >= scripts.length) {
		return;
	}

	console.log('Loading "%s" %d/%d', 
			scripts[index][0], index+1, scripts.length);
	log('Loading "' + scripts[index][0] + '" ' + (index+1) + '/' +
			scripts.length + '');

	// create the new DOM script element from the url
	var script = doc.createElement('script');
	script.setAttribute('src', scripts[index][0]);
	script.setAttribute('type', scripts[index][1]); 

	// TODO now unused... 
	if (scripts[index][2] != null) {
		script.setAttribute('id', scripts[index][2]); 
	}

	// load next file!
	script.onload = function() {
		singleScriptLoader(scripts, index+1, doc, head);
	};

	head.appendChild(script);
	attemptStart();
}

function singleShaderLoader(shaders, index) {
	// stop recurrance
	if (index >= shaders.length) {
		return;
	}

	console.log('Loading "%s" %d/%d', 
		shaders[index][0], index+1, shaders.length);

	var shader = $('<script />')
		.attr('id', shaders[index][2])
		.attr('type', shaders[index][1]);

	shader.load(shaders[index][0], function() {
		singleShaderLoader(shaders, index+1);
	});

	$('head').append( shader );
	attemptStart();
}

/**
 * loads all the .obj and .mtl files for players, critter, environments, etc.
 */
function loadModels() {
	// stupid javascript
	function loadFunc(type, index) {
		return function(evt) {
			var object = evt.content;
			var scale = models[type][index][4];
			object.scale.set(scale, scale, scale);
			models[type][index][0] = object;

			console.log("%s model \"%s\" loaded %d/%d.", type, 
					models[type][index][1], index+1, models[type].length);
			log("" + type + " model \"" + models[type][index][1] + 
					"\" loaded " + (index+1) + "/" + models[type].length + ""); 
			attemptStart();
		};
	}
	console.log("Loading models");
	for (var type in models) {
		for (var i = 0; i < models[type].length; i++) {
			var loader = new THREE.OBJMTLLoader();
			loader.addEventListener( 'load', loadFunc(type, i) );
			loader.load( models[type][i][2], models[type][i][3] );
		}
	}
}

/**
 * loads all the .dae files for animations
 */
function loadAnimations() {
	// stupid javascript
	function loadFunc(type, index) {
		return function(collada) {
			var object = collada.scene;
			var scale = animations[type][index][4];
			object.scale.set(scale, scale, scale);

			animations[type][index][0] = object;
			animations[type][index][1] = collada;

			console.log("%s animation \"%s\" loaded %d/%d.", type, 
				animations[type][index][2], index+1, animations[type].length);
			log("" + type + " animation \"" + animations[type][index][2] + 
					"\" loaded " + (index+1) + "/" + animations[type].length + 
					""); 
			attemptStart();

			// something about collada.skins[0]
		};
	}
	console.log("Loading animations");
	// TODO
	for (var type in animations) {
		// TODO
		for (var i = 0; i < animations[type].length; i++) {
			var loader = new THREE.ColladaLoader();
			loader.load( animations[type][i][3], loadFunc(type, i) );
		}
	}
}

/**
 * Loads all the shaders, using jQuery!
 */
function loadShaders() {
	singleShaderLoader(shaders, 0);
}

/**
 * Guarantees all models, animations, and scripts are loaded before 
 * starting main
 */
function attemptStart() {
	filesLoaded++;
	switch (filesLoaded) {
		case SCRIPTS_NEEDED:
			loadModels();
			break;
		case MODELS_NEEDED + SCRIPTS_NEEDED:
			loadAnimations();
			break;
		case ANIMATIONS_NEEDED + MODELS_NEEDED + SCRIPTS_NEEDED:
			loadShaders();
			break;
		case ANIMATIONS_NEEDED + MODELS_NEEDED + SCRIPTS_NEEDED + 
				SHADERS_NEEDED:
			console.log("Enough loading, time to play!");

			// TODO
			// remove the loading text
			//document.removeChild(document.getElementById("loader"));

			main();
			break;
	}
}
