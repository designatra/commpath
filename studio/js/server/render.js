// file system functions
var fs = require("fs");
var superagent = require("superagent");
var sceneID = "9fc80c3f-a7e5-4925-8c07-8a97e1b8b64a";
var username = "thoughtleader"
var apiToken = "74aebac9-c087-4ae2-9ee9-2ddb9bc79adc"

// to read binary data from superagent
function binaryParser(res, callback) {
	res.setEncoding('binary');
	res.data = '';
	res.on('data', function(chunk) {
		res.data += chunk;
	});
	res.on('end', function () {
		callback(null, new Buffer(res.data, 'binary'));
	});
}
function jobStatusCheck(location, callback) {
	superagent.get(location)
		.auth(username, apiToken)
		.set('Accept', 'application/json')
		.redirects(0)
		.end(function(err, response) {
			if (err || response.statusCode >= 400 || response.body.status === 'failed') {
				return callback(err ||
					new Error('Import error: '+response.statusCode+'\n'+JSON.stringify(response.body)));
			}

			if (response.statusCode === 303) return callback(null, response);

			setTimeout(function() {
				jobStatusCheck(location, callback)
			}, 5000);
		});
}

superagent.post('https://clara.io/api/scenes/'+sceneID+'/render')
	.auth(username, apiToken)
	.end(function(err, response) {
		if (err || response.statusCode >= 400 || response.body.status === 'failed') {
			return complete(err ||
				new Error('Render error: '+response.statusCode+'\n'+JSON.stringify(response.body)));
		}

		jobStatusCheck(response.headers.location, function(err, response2) {
			if (err) return complete(err);

			var stream = fs.createWriteStream('result.jpg');
			stream.on('close', complete);

			superagent.get(response2.headers.location)
				.auth(username, apiToken)
				.pipe(stream);
		});
	});

function complete() {
	console.log(arguments)
}

// superagent.post("https://clara.io/api/scenes/"+sceneID+"/render")
// 	.auth("thoughtleader", "74aebac9-c087-4ae2-9ee9-2ddb9bc79adc")
// 	.end(function(err, response) {
// 		if (err || response.statusCode >= 400 || response.body.status === "failed") {
// 			throw new Error("Renderer error");
// 		} else {
// 			var location = response.headers.location;
// 			jobStatusCheck(location, function(err) {
// 				if (err) {
// 					console.error("Error rendering");
// 				} else {
// 					// render is complete, now ask for the image and save it into a file
// 					superagent.get(location)
// 						.auth("username", "74aebac9-c087-4ae2-9ee9-2ddb9bc79adc")
// 						.parse(binaryParser)
// 						.buffer(true)
// 						.end(function(err, imageResponse) {
// 							fs.writeFile("result.jpg", imageResponse.body, function(err) {
// 								if (err) {
// 									console.error("Couldn't save image 'result.jpg'");
// 								} else {
// 									console.log("image 'result.jpg' downloaded");
// 								}
// 							})
// 						})
// 				}
// 			})
// 		}
// 	});
