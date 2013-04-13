/**
 * client.js
 *
 * Interface clients may use to send data and receive data to and from server
 */

var floatArr = new Float32Array(4);
var someObj = {x:20, y:"hello"};

/* Receive is not needed since it will be call-back
 * */
function send(data) {
	//var datatype = Object.prototype.toString.call(data);
	//console.log("datatype is " + datatype);
	if (connection.readyState != 1) {
		console.log("Connection is not ready yet!");
	} else {
        console.log(myPlayer.position);        
		connection.send(JSON.stringify(data));
		//moveState = JSON.parse(JSON.stringify(data));
	}
}


