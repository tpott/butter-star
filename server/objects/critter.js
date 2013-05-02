
var Critter = function(){
    this.id = null;
    this.position = 
    {
        x : 0,
        y : 0,
        z : 0,
        direction : 0
    };
};

Critter.prototype.init = function() {
}

Critter.prototype.initModel = function(scene, type, size, position) {
    var loader = new THREE.OBJMTLLoader();
                loader.addEventListener( 'load', function ( event ) {
                    var object = event.content;
                    var tempScale = new THREE.Matrix4();
                    object.position.x = position.y;
                    object.position.y = position.x;
                    object.position.z = position.z;
                    

                    object.scale.set(size * .08 ,size * .08,size * .08);
    });
    if(type == "boo")
    {
        loader.load( 'boo.obj', 'boo.mtl' );
    }
}

Critter.prototype.update = function() {

};

module.exports = Critter;
