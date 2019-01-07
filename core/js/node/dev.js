var app = module.exports = {};

var $j = require("./core/js/node/frame.js"),
	_ = require("lodash");

var server = require("http").createServer();
var io = app.io = require("socket.io")(server);

// io.on("connection", function(client){
// 	// client.on("event", function(data){
// 	// 	$j.log("EVENT", data)
// 	// });

// 	// client.on("disconnect", function(){});
// });

server.listen(3000);
