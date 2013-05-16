/**
 * server/objects/OBJLoader
 * @fileoverview Load OBJ files by accessing the filesystem
 * @author Trevor Pottinger
 */

var fs = require('fs');
var THREE = require('three');

// taken from
// https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/OBJLoader.js
function parse ( filename ) {

	var data = fs.readFileSync(filename, 'utf8');

	// fixes

	data = data.replace( /\ \\\r\n/g, '' ); // rhino adds ' \\r\n' some times.

	//

	function vector( x, y, z ) {

		return new THREE.Vector3( x, y, z );

	}

	function uv( u, v ) {

		return new THREE.Vector2( u, v );

	}

	function face3( a, b, c, normals ) {

		return new THREE.Face3( a, b, c, normals );

	}

	function face4( a, b, c, d, normals ) {

		return new THREE.Face4( a, b, c, d, normals );

	}

	function meshN( meshName, materialName ) {

		if ( geometry.vertices.length > 0 ) {

			geometry.mergeVertices();
			geometry.computeCentroids();
			geometry.computeFaceNormals();
			geometry.computeBoundingSphere();

			object.add( mesh );

			geometry = new THREE.Geometry();
			mesh = new THREE.Mesh( geometry, material );

			verticesCount = 0;

		}

		if ( meshName !== undefined ) mesh.name = meshName;
		if ( materialName !== undefined ) {

			material = new THREE.MeshLambertMaterial();
			material.name = materialName;

			mesh.material = material;

		}

	}

	var group = new THREE.Object3D();
	var object = group;

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshLambertMaterial();
	var mesh = new THREE.Mesh( geometry, material );

	var vertices = [];
	var verticesCount = 0;
	var normals = [];
	var uvs = [];

	// v float float float

	var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

	// vn float float float

	var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

	// vt float float

	var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/

	// f vertex vertex vertex ...

	var face_pattern1 = /f( +\d+)( +\d+)( +\d+)( +\d+)?/

	// f vertex/uv vertex/uv vertex/uv ...

	var face_pattern2 = /f( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))( +(\d+)\/(\d+))?/;

	// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

	var face_pattern3 = /f( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))( +(\d+)\/(\d+)\/(\d+))?/;

	// f vertex//normal vertex//normal vertex//normal ...

	var face_pattern4 = /f( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))( +(\d+)\/\/(\d+))?/;

	//

	var lines = data.split( "\n" );

	for ( var i = 0; i < lines.length; i ++ ) {

		var line = lines[ i ];
		line = line.trim();

		var result;

		if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

			continue;

		} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

			// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

			vertices.push( vector(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			) );

		} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

			// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

			normals.push( vector(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] ),
				parseFloat( result[ 3 ] )
			) );

		} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

			// ["vt 0.1 0.2", "0.1", "0.2"]

			uvs.push( uv(
				parseFloat( result[ 1 ] ),
				parseFloat( result[ 2 ] )
			) );

		} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

			// ["f 1 2 3", "1", "2", "3", undefined]

			if ( result[ 4 ] === undefined ) {

				geometry.vertices.push(
					vertices[ parseInt( result[ 1 ] ) - 1 ],
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 3 ] ) - 1 ]
				);

				geometry.faces.push( face3(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++
				) );

			} else {

				geometry.vertices.push(
					vertices[ parseInt( result[ 1 ] ) - 1 ],
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 3 ] ) - 1 ],
					vertices[ parseInt( result[ 4 ] ) - 1 ]
				);

				geometry.faces.push( face4(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					verticesCount ++
				) );

			}

		} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

			// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

			if ( result[ 10 ] === undefined ) {

				geometry.vertices.push(
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 5 ] ) - 1 ],
					vertices[ parseInt( result[ 8 ] ) - 1 ]
				);

				geometry.faces.push( face3(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++
				) );

				geometry.faceVertexUvs[ 0 ].push( [
					uvs[ parseInt( result[ 3 ] ) - 1 ],
					uvs[ parseInt( result[ 6 ] ) - 1 ],
					uvs[ parseInt( result[ 9 ] ) - 1 ]
				] );

			} else {

				geometry.vertices.push(
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 5 ] ) - 1 ],
					vertices[ parseInt( result[ 8 ] ) - 1 ],
					vertices[ parseInt( result[ 11 ] ) - 1 ]
				);

				geometry.faces.push( face4(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					verticesCount ++
				) );

				geometry.faceVertexUvs[ 0 ].push( [
					uvs[ parseInt( result[ 3 ] ) - 1 ],
					uvs[ parseInt( result[ 6 ] ) - 1 ],
					uvs[ parseInt( result[ 9 ] ) - 1 ],
					uvs[ parseInt( result[ 12 ] ) - 1 ]
				] );

			}

		} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

			// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

			if ( result[ 13 ] === undefined ) {

				geometry.vertices.push(
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 6 ] ) - 1 ],
					vertices[ parseInt( result[ 10 ] ) - 1 ]
				);

				geometry.faces.push( face3(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					[
						normals[ parseInt( result[ 4 ] ) - 1 ],
						normals[ parseInt( result[ 8 ] ) - 1 ],
						normals[ parseInt( result[ 12 ] ) - 1 ]
					]
				) );

				geometry.faceVertexUvs[ 0 ].push( [
					uvs[ parseInt( result[ 3 ] ) - 1 ],
					uvs[ parseInt( result[ 7 ] ) - 1 ],
					uvs[ parseInt( result[ 11 ] ) - 1 ]
				] );

			} else {

				geometry.vertices.push(
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 6 ] ) - 1 ],
					vertices[ parseInt( result[ 10 ] ) - 1 ],
					vertices[ parseInt( result[ 14 ] ) - 1 ]
				);

				geometry.faces.push( face4(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					[
						normals[ parseInt( result[ 4 ] ) - 1 ],
						normals[ parseInt( result[ 8 ] ) - 1 ],
						normals[ parseInt( result[ 12 ] ) - 1 ],
						normals[ parseInt( result[ 16 ] ) - 1 ]
					]
				) );

				geometry.faceVertexUvs[ 0 ].push( [
					uvs[ parseInt( result[ 3 ] ) - 1 ],
					uvs[ parseInt( result[ 7 ] ) - 1 ],
					uvs[ parseInt( result[ 11 ] ) - 1 ],
					uvs[ parseInt( result[ 15 ] ) - 1 ]
				] );

			}

		} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

			// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

			if ( result[ 10 ] === undefined ) {

				geometry.vertices.push(
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 5 ] ) - 1 ],
					vertices[ parseInt( result[ 8 ] ) - 1 ]
				);

				geometry.faces.push( face3(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					[
						normals[ parseInt( result[ 3 ] ) - 1 ],
						normals[ parseInt( result[ 6 ] ) - 1 ],
						normals[ parseInt( result[ 9 ] ) - 1 ]
					]
				) );

			} else {

				geometry.vertices.push(
					vertices[ parseInt( result[ 2 ] ) - 1 ],
					vertices[ parseInt( result[ 5 ] ) - 1 ],
					vertices[ parseInt( result[ 8 ] ) - 1 ],
					vertices[ parseInt( result[ 11 ] ) - 1 ]
				);

				geometry.faces.push( face4(
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					verticesCount ++,
					[
						normals[ parseInt( result[ 3 ] ) - 1 ],
						normals[ parseInt( result[ 6 ] ) - 1 ],
						normals[ parseInt( result[ 9 ] ) - 1 ],
						normals[ parseInt( result[ 12 ] ) - 1 ]
					]
				) );

			}

		} else if ( /^o /.test( line ) ) {

			// object

			object = new THREE.Object3D();
			object.name = line.substring( 2 ).trim();
			group.add( object );

		} else if ( /^g /.test( line ) ) {

			// group

			meshN( line.substring( 2 ).trim(), undefined );

		} else if ( /^usemtl /.test( line ) ) {

			// material

			meshN( undefined, line.substring( 7 ).trim() );

		} else if ( /^mtllib /.test( line ) ) {

			// mtl file

		} else if ( /^s /.test( line ) ) {

			// smooth shading

		} else {

			// console.log( "THREE.OBJLoader: Unhandled line " + line );

		}

	}

	// add the last group
	meshN( undefined, undefined );

	return group.children[0]; 

}

module.exports.parse = parse;
