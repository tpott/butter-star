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
	"jquery.js",

	// objects (+ models?) - TODO trevor, include models in objects
	"player.js", "worldstate.js", "critter.js",
	
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
	"minimap.js", "options.js",

	// this defines main()
	"main.js"
];

var models = {
	player : [],
	critters : [],
	environment : [],
	food : []
};

// entries are structured: [our name, obj, mtl, scale]
var modelFiles = {
	player : [
		'Yixin Cube', 
		],
	critters : [],
	environment : [],
	food : []
};

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

/**
 * loads all the .obj and .mtl files for players, critter, environments, etc.
 */
function initModels() {
   var loader = new THREE.OBJMTLLoader();
      loader.addEventListener( 'load', function ( event ) {

         var object = event.content;
         //object.scale.set(.1,.1,.1);
         scene.add( object );
         // object and scale
         models.environment.push([object,1.]);
         console.log("environment loaded");

      });
   loader.load( 'roomWithWindows.obj', 'roomWithWindows.mtl' );

   var playerLoader = new THREE.OBJMTLLoader();
      playerLoader.addEventListener( 'load', function ( event ) {

         var object = event.content;
         //object.scale.set(.1,.1,.1);
         // object and scale
         models.player.push([object,0.2]);
         console.log("player loaded");

      });
   playerLoader.load( 'boy.obj', 'boy.mtl' );

}
