var Player = function() {
    this.id = null;
    var geometry = new THREE.CubeGeometry(1,3,1); 
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture("player.png")});

    this.mesh = new THREE.Mesh(geometry, material);

    this.position = new THREE.Vector4(0,0,0,0);
	 this.orientation = new THREE.Vector4(1,0,0,0);
	 this.state = 0;

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

	// TODO probably remove
    this.camera =
    {
        speed : 300,
        distance : 5,
        x : 0,
        y : 0,
        z : 0
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
