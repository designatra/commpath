/*
	supports plugin > actors.js

	Event registery holding events that possibly get bound to a chained $j(this)

	$j(this).actors({
		type:"links"
	});
*/
$j.actors("register", {
	network: function(e) {
		var $inspector = $j(this);

		$j.what("network").network.on("click", function (e) {
			$j.log(e);

			var node = $j.o("node", this.getNodeAt(e.pointer.DOM));

			var entity = node.entity;
			if(!entity) {
				return false;
			}

			var application = $j.o("application", entity.id);

			$inspector.build("inspector.content", {
				title:application,
				logistics:node.logistics
			})

		});
	}
});
