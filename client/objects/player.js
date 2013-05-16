var Player = function(playerObj) {
    this.id = playerObj.id;
	 /*
    var geometry = new THREE.CubeGeometry(1,3,1); 
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture("player.png")});
	 */

	 // models is a global from main
	 // first index is the default model, second index is the mesh or scale
    this.mesh = new THREE.Mesh(models.player[playerObj.model][0].geometry,
			 models.players[playerObj.model][0].material);

    this.position = new THREE.Vector4(
			 playerObj.position.x,
			 playerObj.position.y,
			 playerObj.position.z,
			 playerObj.position.w
		);
    this.orientation = new THREE.Vector4(
			 playerObj.orientation.x,
			 playerObj.orientation.y,
			 playerObj.orientation.z,
			 playerObj.orientation.w
		);
	 this.state = playerObj.state;

	 // TODO remove 
	this.vacuum = null;
	this.vacTrans = new THREE.Vector3(0,0,0);
    this.direction = null;
    this.isVacuum = false;
    this.vacAngleY = 0;

	 // TODO maybe remove
	this.model =
    {		
        objects : new THREE.Object3D(),
        motion  : 'stand',
        state   : 'stand'
    };
};

Player.prototype.setMesh = function(scene) {
    var playerLoader = new THREE.OBJMTLLoader();
    var me = this;
    playerLoader.addEventListener( 'load', function (event) {
        var object = event.content;
        object.scale.set(.04, .04, .04);
        me.mesh = object;
        scene.add(me.mesh);
    });
    playerLoader.load('boy.obj', 'boy.mtl');
};
