$j.build("component").grid = {
	/*
		COMPONENT: "grid"

		$j.el("papa").build("grid", {
			id:"schedule",
			rows:[
				[
					{
						date:"03/07/2017",
						amount:78
					},
					{
						date:"04/07/2017",
						amount:78
					}
				],
				[
					{
						date:"05/07/2017",
						amount:78
					},
					{
						date:"06/07/2017",
						amount:78
					}
				]
			]
		})
	*/
	build: function(data) {
		return $j(this).build("grid", data, {
			after:function(i, o) {
				$j(this).find("rows").build("row", o.rows, function(i, columns) {
					$j(this).build("column", columns, function(i, column) {
						var o = column;
						if(o.date) {
							o.date = o.date;
						}
						if(o.amount) {
							o.amount = accounting.formatMoney(o.amount);
						}
						
						var $cell = $j(this).build("cell", o);

						if(o.amount) {
							$cell.build("icon.close-fill");
						}
					});
				});
			},
			events:{
				after:[
					{
						name:"payment"
					}
				]
			}
		});
	},
	events:{
		payment: function() {
			$j(this)
				.on({
					"add.payment": function() {
						
					},
					"remove.payment": function() {
						
					}
				})
			$j(this)
				.find("row").on({
					enable: function(e) {
						$j(this)
							.removeClass("disabled")
							.velocity("transition.slideLeftBigIn",  {
								duration:400,
								display:"flex"
							});

						var $rows =  $j(this).parent("rows");
						$rows.attr("disabled-rows", $rows.children("row").not(".disabled").length);
					},
					disable: function(e) {	
						$j(this)
							.addClass("disabled")
							.velocity("transition.slideLeftBigOut",  {
								duration:400,
								display:"none"
							});

						var $rows =  $j(this).parent("rows");
						$rows.attr("disabled-rows", $rows.children(".disabled").length);
					},
					edit: function() {
						if($j(this).is("[edit=true]")) {
							return $j(this).trigger("stop.edit");
						}
						return $j(this).trigger("start.edit");
					},
					"start.edit": function(e) {
						$j(this)
							.attr("edit", true)
							.find("column").each(function(i, $cell) {
								$j(this).find("field").remove();

								$j(this).methods(i, {
									// Date
									0: function() {
										return $j(this).build("field.date-payment");
									},
									// Payment Amount
									1: function() {
										return $j(this).build("field.payment$");
									}
								});
							});
					},
					"stop.edit": function(e) {
						$j(this)
							.attr("edit", false)
							.find("cell > field").remove();
					}
				})
				.on({
					click: function(e) {
						$j(this).trigger("start");
					}
				}, "cell")
				.on({
					click: function(e) {
						e.stopImmediatePropagation();

						if($j(e.delegateTarget).is(".disabled")) {
							return $j(e.delegateTarget).trigger("enable");
						}
						return $j(e.delegateTarget).trigger("disable");
					}
				}, "[action=remove]");
		}
	}
};
