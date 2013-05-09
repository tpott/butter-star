
// Get external functions
var THREE = require('three');
var util = require('util');

var Movable = require('./movable.js');

function Critter(){
    Critter.super_.call(this);

    // TODO need radius, center (default 0,0,0 from Movable)
    //this.initModel();
}
util.inherits(Critter, Movable);

Critter.prototype.init = function() {
}

Critter.prototype.initModel = function(scene, type, size, position) {
    /*
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
    */
}

Critter.prototype.update = function() {

};

module.exports = Critter;
