/**
 * Defines just about everything... 
 * @author Thinh
 * @cretor Trevor
 */

//GLOBALS AND SHIT
var timer; // TODO not being used

var scene = new THREE.Scene(); 
var stats = new Stats();
var audio = document.createElement('audio');
var source = document.createElement('source');
var renderer = new THREE.WebGLRenderer(); 

// needed in client/net/loader.js, so before this file is loaded
/*var models = {
	player : [],
	critters : [], 
	environment : [],
	food : []
};*/

// mouseMoved and rotateStart from client/controls/mouse.js
document.addEventListener( 'mousemove', mouseMove, false );
//document.addEventListener('mousedown', rotateStart, false);

// keyDown and keyUp from client/controls/keyboard.js
document.addEventListener( 'keydown', keyDown, false );
document.addEventListener( 'keyup', keyUp, false );

var minimap = null;
var optionMenu = null;

var PI_2 = Math.PI / 2;
var fullScreenMode = 0;
var myPlayer = null;

var ipAddr = "butterServerIp"; // replaced in server/net/fullHTTP.js
var port = "butterServerPort"; // replaced in server/net/fullHTTP.js
var gameid = document.URL.replace(/.*\//,'');

// dont iniailize until main()
var myWorldState = null,
	 camera = null;
	 connection = null;

// each key press will append something here,
// on each client tick the keypresses will be sent and 
// this will get emptied
var keyPresses = [],
	 oldKeyPresses = [];
var mouseMovement = [0, 0], // [x, y]
	 mouseClicks = [];

//only init the worldState once at the very beginning;
var initWorldState = true;
///Octree Code, eventually will need to port over to the server

var hasBeenSent = true; // prevents sending idle events
//-------------------------------------------------------
//HELPER FUNCTIONS AND SHIET
//-------------------------------------------------------

//clone: javascript doesnt like pass by value; use this to copy elements by value
function clone(obj) {
if (null == obj || "object" != typeof obj) return obj;
var copy = obj.constructor();
for (var attr in obj) {
	if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
}
	return copy;
}


//-------------------------------------------------------
//FUNCTIONS AND SHIET
//-------------------------------------------------------

/*
update the states of the game
examples:
	player position
	monster positions
	calculation heavy stuff go here
*/
function update() {
	// skip if myPlayer is not initd
	if (myPlayer == null || myPlayer.id == null) return; 

	// begin camera update
	//   update camera position
	camera.position = myPlayer.position.clone().sub(
			myPlayer.orientation.clone().multiplyScalar(8))
	//camera.position.add(new THREE.Vector4(7, 3, 0, 0));
	
	//   update camera orientation
	camera.lookAt( myPlayer.position );
}

//render all other player animations
function updateAnimations() {
	// vacuum animations
	for (var id in myWorldState.players) {
		var player = myWorldState.players[id];

		if (player.isVacuuming() && player.vacuum == null) {
			player.startVacuuming();
		}
		else if (player.isVacuuming()) {
			player.updateVacuum();
		}
		else if (! player.isVacuuming() && player.vacuum != null) {
			player.stopVacuuming();
		}
	}
}

/*
	renderin' shit
*/
function render() { 
	requestAnimationFrame(render); 
	
	update();
	updateAnimations();
	
	renderer.render(scene, camera); 
	stats.update();
}

//place to initialize lights (temporary, may not need)
function initLights() {
		var light = new THREE.PointLight( 0xffffff, 1, 1000); 
		light.position.set( 0, 20, 0 ); 
		scene.add( light );
}

//load sound clips here
function initSounds()
{
	source.src = 'Paris2.ogg';
	audio.appendChild(source);
	audio.play();
}

//initialize the fps counter
function initStats() {
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
}

function main() {
	initStats();
	initLights();
    //initModels();
	// initTextures();
	initSounds();
	//initFloor();
	//initRoom();
  audio.pause();
	//controls.disable;

	myWorldState = new WorldState();

	// sets myPlayer to the correct player object in myWorldState
	connection = new Connection(ipAddr, port, gameid, myWorldState);
	
	minimap = new Minimap();
	minimap.drawCircle();
	optionMenu = new OptionMenu();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.up = new THREE.Vector3(0,1,0);

	renderer.setSize(window.innerWidth, window.innerHeight); 
	document.body.appendChild(renderer.domElement); 
	document.body.appendChild( stats.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	$('canvas').addClass('game');
	render(); 
}
