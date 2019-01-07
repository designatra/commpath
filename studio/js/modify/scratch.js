inspected: function(e) {
	/*
		inspection: {
			instance: {
				data:{},
				id:"17839222",
				index:0
			},
			inventory: {
				buildable:{},
				dependencies:{},
				meta:{},
				mock:{},
				relationships:{},
				variables:{}
			},
			name:"field.select",
			type:"mouseleave",
			usage:{
				action:{
					count:1,
					instances:{} <<NA
				},
				action.button:{},
				...,
				...
			}
		}
	*/
	
	var inspection = e.inspection;

	$j("[type=tbody][tab=in-use]")
		.find("item.inspecting").removeClass("inspecting")
		.end().find("item[type='"+inspection.name+"']").addClass("inspecting")
		//.studio("inspect")
	// panels.elements.inuse.init(usage)
}
