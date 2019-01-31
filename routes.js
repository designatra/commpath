var config = require("./config");

var express = require("express"),
	_ = require("lodash");

var utils = {
	build:require("./build"),
	path: require("path"),
	cors: require('cors'),
	decache: require('decache')
};

var router = express.Router();

var corsOptions = {};
corsOptions.origin = "*";
corsOptions.methods = "GET,HEAD,PUT,PATCH,POST,DELETE";

router.post("/buildable", utils.cors(corsOptions), function (req, res, next) {
	utils.decache('./config');
	config = require("./config");;

	var query = req.body;

	var mergedConfig;
	if(query) {
		mergedConfig  = _.defaultsDeep(config, require("."+utils.path.join(query.project, "config")));
		mergedConfig.js.elements  = _.defaultsDeep(mergedConfig.js.elements, query.elements);
	}

	utils.build("http", mergedConfig, function(data) {
		res.json(data);
	});
});

// router.get("/patterns", function(req, res) {
// 	res.send('patterns')
// });

// router.get("/", function (req, res) {
// 	res.send("root")
// 	//res.render("index");
// 	// res.render("index", {
// 	// 	title1: "Hey!",
// 	// 	message: "Hello there!"
// 	// });
// });

module.exports = router;

