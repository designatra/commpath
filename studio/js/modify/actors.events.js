/*
	supports plugin > actors.js

	Event registery holding events that possibly get bound to a chained $j(this)

	$j(this).actors({
		type:"links"
	});
*/
$j.actors("register", {
	loaded: function(e) {

	}
});
