$j.build("component").cards = {
	/*
		COMPONENT: "cards"

		$el.build("cards");

		$el.build("build("cards", {
			id:"one_col_sandbox"
		});

		$el.build("build("cards", {
			id:"two_col_sandbox",
			columns:2
		});

		<cards attr="id:id,type:type,visible:visible,columns:columns||layout.columns" columns="1">
RETURNS>>>> <wrapper></wrapper>
		</cards>
	*/
	build: function(data, config) {
		var $return;

		$j(this).build("cards", data, {
			after: function(i, o) {
				var $cards = $return = $j(this).children("wrapper");
				if(config.after) {
					// NOTE: Since cards have header content handled by component, the card body element is being returned instead
					config.after.apply($cards, arguments);
				}

				//$j.build("component").cards.events.default.apply($j(this), [o]);
			}
		});

		return $return;
	},
	events: {
		// $j.build("component").cards.events.default.apply($j(this), [o]);
		default: function() {

		}
	}
};
