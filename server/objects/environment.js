/**
 * server/objects/environment.js
 */

var THREE = require('three');
var util = require('util');

var Collidable = require('./collidable.js');

function Environment() {
  Environment.super_.call(this);

	var geometry = new THREE.Geometry();
      geometry.vertices.push( new THREE.Vector3( 100,  100, 100 ) );
      geometry.vertices.push( new THREE.Vector3( 100, 100, -100 ) );
      geometry.vertices.push( new THREE.Vector3( 100, -100, 100 ) );
      geometry.vertices.push( new THREE.Vector3( 100, -100, -100 ) );
      geometry.vertices.push( new THREE.Vector3( -100,  100, 100 ) );
      geometry.vertices.push( new THREE.Vector3( -100,  100, -100 ) );
      geometry.vertices.push( new THREE.Vector3( -100,  -100, 100 ) );
      geometry.vertices.push( new THREE.Vector3( -100,  -100, -100 ) );

	var verts = geometry.vertices;

    geometry.faces.push( new THREE.Face4( 0, 1, 3, 2) );
   geometry.faces.push( new THREE.Face4( 5, 4, 6, 7) );
   geometry.faces.push( new THREE.Face4( 1, 5, 7, 3) );
   geometry.faces.push( new THREE.Face4( 4, 0, 2, 6) );
   geometry.faces.push( new THREE.Face4( 0, 4, 5, 1) );
   geometry.faces.push( new THREE.Face4( 3, 7, 6, 2) );

     var material = new THREE.MeshBasicMaterial();
  this.mesh = new THREE.Mesh( geometry, material );

}

util.inherits(Environment, Collidable);

module.exports = Environment;
