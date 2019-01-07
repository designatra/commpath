$j.build("component").icon = {
	/*
		COMPONENT: "icon"

		$el.build("icon", {
			icon:"oneui-fill-question"
		})
	*/
	build: function(data, config) {
		return $j(this)
			.build("icon", data, defined(config, {}))
			.parent();
	},
	/*
		$el.build("icon.question-fill")
	*/
	"question-fill":{
		build: function(data) {
			return $j(this).build("icon", 
				{
					icon:"oneui-fill-question"
				}
			);
		}
	},
	/*
		$el.build("icon.add-fill")
	*/
	"add-fill":{
		build: function(data) {
			return $j(this).build("icon", 
				{
					icon:"oneui-android-add-circle"
				}
			);
		}
	},
	/*
		$el.build("icon.clear-field")
	*/
	"clear-field":{
		build: function(data) {
			return $j(this).build("icon", 
				{
					icon:"oneui-cancel-circled",
					action:"remove"
				},
				{
					events:{
						after:["clear-field"]
					}
				}
			);
		}
	},
	/*
		$el.build("icon.contextual-help")
	*/
	"contextual-help":{
		build: function(data) {
			return $j(this).build("icon", 
				{
					icon:"oneui-fill-question",
					action:"contextual-help"
				},
				{
					events:{
						after:["contextual-help"]
					}
				}
			);
		}
	},
	/*
		$el.build("icon.datepicker")
	*/
	"datepicker":{
		build: function(data) {
			return $j(this).build("icon", 
				{
					icon:"oneui-core-calendar2",
					action:"datepicker"
				},
				{
					events:{
						after:["datepicker"]
					}
				}
			);
		}
	},
	events: {
		"datepicker": function() {
			$j(this)
				.on({
					click: function(e) {
						e.stopImmediatePropagation();

						var $field = $j(this).closest("field"),
							$datepicker = $field.datepicker("widget");
						
						if($field.is("[datepicker=visible]")) {
							return hidePicker();
						}
						return showPicker();
						
						//TODO: Yuckkky (jqueryui datepicker sucks)
						function hidePicker() {
							return $field
								.attr("datepicker", "hidden")
								.datepicker("hide");
						}
						function showPicker() {
							$field
								.attr("datepicker", "visible")
								.datepicker("show")
								.datepicker("widget").position({
									my: "left top-1",
									at: "left bottom",
									of: $field
								});
						}
					}
				});
		},
		"clear-field": function() {
			$j(this)
				.on({
					click: function(e) {
						e.stopImmediatePropagation();

						$j(this)
							.closest("field").field("$input").val("")
							.trigger("focus");
					}
				});
		},
		"contextual-help": function() {
			$j(this)
				.on({
					click: function(e) {
						e.stopImmediatePropagation();

						$j(this).trigger("toggle.contextual-help");
					}
				})
				.closest("field").on({
					"focused.contextual-help": function(e) {
						if($j(this).is("[contextual-help=on]")) {
							return $j(this).trigger("off.contextual-help");
						}
					},
					"keydown.contextual-help": function(e) {
						$j(this).trigger("focused.contextual-help");
					},
					"toggle.contextual-help": function(e) {
						if($j(this).is("[contextual-help=on]")) {
							return $j(this).trigger("off.contextual-help");
						}
						return $j(this).trigger("on.contextual-help");
					},
					"on.contextual-help": function(e) {
						 $j(this)
						 	.attr("contextual-help", "on")
						 	.find("message[for=contextual-help]").velocity("transition.slideRightIn", {
						 		duration:300,
							 	display: "flex"
							 });

						return $j(this);

					},
					"off.contextual-help": function(e) {
						 $j(this)
						 	.attr("contextual-help", "off")
						 	.find("message[for=contextual-help]").velocity("transition.slideRightOut", {
						 		duration:300,
							 	display: "none"
							 });
					}
				})
				.trigger("off.contextual-help");
		}
	}
};
