var Player = function() {
    this.id = null;
    var geometry = new THREE.CubeGeometry(1,3,1); 
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: THREE.ImageUtils.loadTexture("player.png")});

    this.mesh = new THREE.Mesh(geometry, material);
	this.vacuum = null;
	this.vacTrans = new THREE.Vector3();
    this.model =
    {		
        objects : new THREE.Object3D(),
        motion  : 'stand',
        state   : 'stand'
    };
    this.position = 
    {
        x : 0,
        y : 0,
        z : 0,
        direction : 0
    };
    this.camera =
    {
        speed : 300,
        distance : 5,
        x : 0,
        y : 0,
        z : 0
    };
};

// TODO global = BAD!!! **HACK**
//var myPlayer = new Player();
