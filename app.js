var config = require("./config");

var express = require("express"),
	_ = require("lodash");

var utils = {
	build:require("./build"),
	cors: require("cors"),
	path: require("path"),
	bodyParser: require("body-parser"),
	fs: require("fs"),
	// Experimental features
	jsdom: require("jsdom"),
	less: require("less")
};

var whitelist = ['http://localhost:9000', 'http://csaa.design']
var corsOptions = {}
corsOptions.origin = "*";
corsOptions.methods = "GET,HEAD,PUT,PATCH,POST,DELETE";


var app = express();
app.use(utils.cors(corsOptions));
app.use(utils.bodyParser.json());
app.use(utils.bodyParser.urlencoded({ extended: false }));

/*
// this engine requires the fs module
app.engine("go", function (filePath, options, callback) {
	utils.fs.readFile(filePath, function (err, content) {
		if (err) {
			return callback(err);
		}

		var newScript = document.createElement("script");
		newScript.setAttribute("src", filePath);
		document.head.appendChild(newScript);


		var rendered = content;

		return callback(null, rendered);
	});
});
app.set("views", "./views") // specify the views directory
app.set("view engine", "go") // register the template engine
*/

var routes = require("./routes");
app.use("/", routes);

app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});



// var	jquery = utils.fs.readFileSync(utils.path.join("./", config.paths.core.js, "jquery.js"), "utf-8");

// utils.jsdom.env({
// 	file:"./"+element.path,
// 	src:[jquery],
// 	done: function(err, window) {
// 		if(err) {
// 			return err;
// 		}

// 		var $j = window.$;

// 		var styles = "@import 'styles'; " + $j("style").text();
// 		return renderLess(styles, function(output) {
// 			var out = output, css;
// 			if(out) {
// 				css = out.css;
// 				if(!css) {
// 					css = "";
// 				}
// 			} else {
// 				css = ""
// 			}

// 			return after(element, {
// 				style: "<style id='"+element.name+"' type='text/css'>"+css+"</style>",
// 				html: $j("body").html()
// 			});
// 		})
// 	}
// });

module.exports = app;
