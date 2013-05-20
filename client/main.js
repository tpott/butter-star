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
var keyPresses = [];
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

	/*var updatedMyPlayer = myWorldState.getPlayerObject(myPlayer.id);

	// skip if undefined
	if (!updatedMyPlayer) return;

	myPlayer.mesh = updatedMyPlayer.mesh;
	myPlayer.orientation = updatedMyPlayer.orientation;*/
	//cube.position = clone(myPlayer.position);
	//cube.position.y = -2;
	/*myPlayer.model.objects.position.x = myPlayer.position.x;
	myPlayer.model.objects.position.y = myPlayer.position.y;
	myPlayer.model.objects.position.z = myPlayer.position.z;*/

	// begin camera update
	//   update camera position
	camera.position = myPlayer.position.clone().sub(myPlayer.orientation);
	camera.position.add(new THREE.Vector4(5, 3, 0, 0));
	
	//   update camera orientation
	camera.lookAt( myPlayer.position );

	//myPlayer.mesh.rotation.x = (myPlayer.camera.x / 2 % 360) * Math.PI / 180.0;
	//var ang = (myPlayer.camera.x / 2 % 360) * Math.PI / 180.0;

	//myWorldState.getPlayerObject(myPlayer.id).mesh.rotation.y = ang + 1.65;
	//myPlayer.mesh.rotation.y = ang + 1.65;
	//updatePlayersAnimation();
}

//render all other player animations
function updatePlayersAnimation() {
  for(player in myWorldState.players)
  {
		var players = myWorldState.players[player];
		//only add vacuum for other players
		if(players.isVacuum == true && players.id != myPlayer.id)
		{
			 if(players.vacuum == null)
			 {
				  console.log("generated first vacuum for player");
				  players.vacuum = new Vacuum(
						new THREE.Vector3(players.mesh.position.x, players.mesh.position.y,
						players.mesh.position.z), 
						new THREE.Vector3(0,0,-1),
						1000, 
						document.getElementById('vertexShader').textContent, 
						document.getElementById('fragmentShader').textContent);
				  players.vacuum.update(players.vacTrans,players.direction);  
				  players.vacuum.addToScene(scene);   
			 }
			 else
			 {
				  players.vacuum.update(players.vacTrans,players.direction,players.vacAngleY);
			 }
		}
		else if(players.vacuum != null)
		{

			players.vacuum.removeFromScene(scene);
			players.vacuum = null;
		}
		//update player angles
		players.mesh.rotation.y = players.direction * Math.PI / 180.0 + 1.65;
 }
}

/*
	renderin' shit
*/
function render() { 
	requestAnimationFrame(render); 
	
	update();
	
	renderer.render(scene, camera); 
	stats.update();
}

//place to initialize lights (temporary, may not need)
function initLights() {
		var light = new THREE.PointLight( 0xffffff, 1, 1000); 
		light.position.set( 0, 20, 0 ); 
		scene.add( light );
}

//load them textures here
/*function initTextures() {
	var neheTexture;
	function initTexture() {
	neheTexture = gl.createTexture();
	neheTexture.image = new Image();
	neheTexture.image.onload = function()
	{
		handleLoadedTexture(neheTexture)
	}

	neheTexture.image.src = "player.png";
	}
}*/

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

/*
function initFloor() {
		var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,-10,0));
		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
			face.vertexColors[ 1 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
			face.vertexColors[ 2 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
			face.vertexColors[ 3 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
		}

		var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );
}

var de;
function initRoom() {
  var geometry = new THREE.Geometry();

  geometry.vertices.push( new THREE.Vector3( 100,  100, 100 ) );
  geometry.vertices.push( new THREE.Vector3( 100, 100, -100 ) );
  geometry.vertices.push( new THREE.Vector3( 100, -100, 100 ) );
  geometry.vertices.push( new THREE.Vector3( 100, -100, -100 ) );
  geometry.vertices.push( new THREE.Vector3( -100,  100, 100 ) );
  geometry.vertices.push( new THREE.Vector3( -100,  100, -100 ) );
  geometry.vertices.push( new THREE.Vector3( -100,  -100, 100 ) );
  geometry.vertices.push( new THREE.Vector3( -100,  -100, -100 ) );

  geometry.faces.push( new THREE.Face4( 0, 1, 3, 2) );
  geometry.faces.push( new THREE.Face4( 5, 4, 6, 7) );
  geometry.faces.push( new THREE.Face4( 1, 5, 7, 3) );
  geometry.faces.push( new THREE.Face4( 4, 0, 2, 6) );
  geometry.faces.push( new THREE.Face4( 0, 4, 5, 1) );
  geometry.faces.push( new THREE.Face4( 3, 7, 6, 2) );

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
			face.vertexColors[ 1 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
			face.vertexColors[ 2 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
			face.vertexColors[ 3 ] = new THREE.Color().setRGB( Math.random() * 0.8, Math.random() * 0.8, Math.random() * 0.8 );
		}

		var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
		var mesh = new THREE.Mesh( geometry, material );
    mesh.material.color.setRGB(1,0,0);
    de = mesh;  		
scene.add( mesh );
    
}
*/


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
