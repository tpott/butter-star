/**
 * Defines just about everything... 
 * @author Thinh
 * @cretor Trevor
 */

//GLOBALS AND SHIT
var loader = new THREE.OBJMTLLoader();
var scene = new THREE.Scene(); 
var stats = new Stats();
var audio = document.createElement('audio');
var source = document.createElement('source');
var renderer = new THREE.WebGLRenderer({
  antialias : true,
  preserveDrawingBuffer : true
}); 
var chatbox_messages = [];
var hackysolution = false;

var myName = "";
var options_disableKeyPresses = false;
var chatbox_disableKeyPresses = false;
//sounds
var myAudio = new Audio('Birds.ogg');
var themeAudio = new Audio('AnotherOneBitesTheDust.ogg');
var vacAudio = new Audio('vacuum_clip.ogg');
var critterDeathAudio = new Audio('critter_death.ogg');
var fastGiggleAudio= new Audio('fast_giggle.ogg');
var heheheAudio= new Audio('he_he_he.ogg');

// needed in client/net/loader.js, so before this file is loaded
/*var models = {
	player : [],
	critters : [], 
	environment : [],
	foods : []
};*/

// mouseMoved and rotateStart from client/controls/mouse.js
//document.addEventListener('mousedown', rotateStart, false);

// keyDown and keyUp from client/controls/keyboard.js
document.addEventListener( 'mousemove', mouseMove, false );
document.addEventListener( 'keydown', keyDown, false );
document.addEventListener( 'keyup', keyUp, false );

// GUI stuff
var minimap = null;
var optionMenu = null;
var chatBox = null;
var scoreBoard = null;
var notifyBar = null;
var statusBox = null;
var gameTimer = null; // TODO not being used

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

function chatbox_sendMessage() {
    var msg = $("#chatinput").val();
    connection.sendChatMessage(msg);
    chatBox.toggle();
}

function chatbox_receiveMessage(messages) {
    this.chatbox_messages.concat(messages);
    var cbox = $('#chatbox_messages');
    for (var i = 0; i < messages.length; i++) {
        cbox.prepend(messages[i].player + ": " + messages[i].msg +"<br/>");
    }
    cbox.animate({ scrollTop: 100 }, "slow");
}

function setName() {
    myName = $("#nametagbox").val();
    connection.sendName(myName);
    optionMenu.toggle();
}

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
	// update camera position
	camera.position = myPlayer.position.clone().sub(
	myPlayer.orientation.clone().multiplyScalar(15))
    camera.position.add(new THREE.Vector3(0, 5, 0));
	
	// update camera orientation
	camera.lookAt( myPlayer.position.clone().add(new THREE.Vector3(0,5,0) ));
}

function startVacuumSound() {
    vacAudio.load();
    vacAudio.play();
}

function stopVacuumSound() {
    vacAudio.pause();
}

//render all other player animations
function updateAnimations() {
	// vacuum animations
	for (var id in myWorldState.players) {
		var player = myWorldState.players[id];

		if (player.isVacuuming() && player.vacuum == null && player.charge > 0) {
			player.startVacuuming();
            if (id == myPlayer.id) {
                startVacuumSound();
            }
		}
		else if (player.isVacuuming() && player.charge > 0) {
			player.updateVacuum();
		}
		else if (! player.isVacuuming() || player.charge <= 0) {
			player.stopVacuuming();
            if (id == myPlayer.id) {
                stopVacuumSound();
            }
		}

		if (player.animation != null) {
			player.animation.update();
		}
	}
    if (myPlayer != null) {
	    myPlayer.plusOneAnimation();
		myPlayer.critterHealth(myWorldState.critters);
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
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    var light = new THREE.PointLight( 0xffffff, 1, 2000); 
    light.position.set( 0, 500, 0 ); 
    scene.add( light );

    var slight = new THREE.SpotLight(0xFFFFFF, 1, 0, Math.PI, 1);
    slight.target.position.set(0,0,0);
    slight.position.set(0, 200,0);
    slight.shadowCameraNear = 10;
    slight.shadowCameraFar = 300;
    slight.castShadow = true;
    slight.shadowBias = .0001;
    slight.shadowDarkness = .5;
    //slight.shadowCameraVisible = true;

    slight.shadowMapHeight = 2048;
    slight.shadowMapWidth = 2048;

    //slight.shadowCameraRight = 20;
    //slight.shadowCameraLeft = -20;
    //slight.shadowCameraTop = 20;
    //slight.shadowCameraBottem = -20;

    scene.add(slight);
}

//load sound clips here

function initSounds()
{
  myAudio.play();
  myAudio.addEventListener('ended', function() { 
      myAudio.load();
      myAudio.play();
    }, false); 
  themeAudio.play();
  themeAudio.addEventListener('ended', function() { 
      themeAudio.load();
      themeAudio.play();
    }, false); 
  vacAudio.addEventListener('ended', function() {
    vacAudio.load();
    vacAudio.play();
    }, false);
}

//initialize the fps counter
function initStats() {
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.right = '0px';
	stats.domElement.style.zIndex = 100;
}

function initZero() {
  var geometry = new THREE.CubeGeometry( 20, 20, 20 );
var material = new THREE.MeshBasicMaterial();

// white cube, center of screen
cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
}

function initSkyBox()
{
	loader.addEventListener('load', function(event){
		var skybox = event.content;
		skybox.position.y -= 4.93; // magic number from server/objects/environment.js
		scene.add(skybox);
    
	});
	loader.load('skybox.obj', 'skybox.mtl');
}



function main() {
	renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.setClearColorHex(0x0000ff, 1);
  initStats();
	initLights();
    //initModels();
	// initTextures();
	initSounds();
  initZero();
	initSkyBox(); 
	//initFloor();
	//initRoom();
  //audio.pause();
	//controls.disable;

	myWorldState = new WorldState();

	// sets myPlayer to the correct player object in myWorldState
	connection = new Connection(ipAddr, port, gameid, myWorldState);
	
	minimap = new Minimap();
	minimap.drawCircle();
	optionMenu = new OptionMenu();
    chatBox = new ChatBox();
	scoreBoard = new ScoreBoard();
	notifyBar = new Notify();
    statusBox = new StatusBox();
    gameTimer = new Timer();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.up = new THREE.Vector3(0,1,0);

	renderer.setSize(window.innerWidth, window.innerHeight); 
	document.body.appendChild(renderer.domElement); 
	document.body.appendChild( stats.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
	
    var self = this;
	function randomAudio() {
        setTimeout(randomAudio, (Math.random() * (25 - 8) + 8) * 1000);
		self.heheheAudio.load();
		self.heheheAudio.play();
	}
	setTimeout(randomAudio, (Math.random() * (25 - 8) + 8) * 1000);

	$('canvas').addClass('game');
	render(); 
}
