/*
	build.js > Plugin Pattern

	After > PLUGINS
		If a plugin or a list of plugins is specified (including init params) to run after each fragment 
			PROCESS PIPING > runs after event init (after() THEN after events THEN plugins init)	
		If an object is passed, the key > "$" allows a custom selector to be passed

	Completed > PLUGINS
		If a plugin or a list of plugins is specified (including init params) to run after all fragments have been added to dom		
		If an object is passed, the key > "$" allows a custom selector to be passed
*/

// AFTER
plugins: {
	after:"draggable"
}

plugins:{
	after:{
		name:"draggable"
	}
}

plugins:{
	after:[
		{
			name:"draggable"
		},
		{
			name:"droppable"
		}
	]
}

// COMPLETED
plugins: {
	completed:"draggable"
}

plugins:{
	completed:{
		$:"#sites action",
		name:"droppable"
	}
}

plugins:{
	completed:[
		{
			name:"draggable"
		},
		{
			name:"droppable"
		}
	]
}

/*
	component > ACTION.js plugin objects
*/
plugin:{
	drop_down:{
		// Drop down plugin is initiated by the action that toggles items visibility (vs when it's a full blown action block )
		items:{
			init_state:"expanded",
			selector: "[dropdown=notification_settings]"
		}
	}
}



/*
	component > ACTION.BLOCK.js plugin objects
*/

plugin:{
	progress_circle:{
		// Appends fragment found in the buildable element > drop_down.dashboard-claim.html 
		selector:">wrapper>wrapper:first",
		// Then populates the above fragment with the following data
		properties:{
			value: random([20,90])/100,
			startAngle:(270/180)*Math.PI,
			size: 66,
			thickness:3,
			fill: "#0096d6",
			emptyFill:"#EBEBEB"
		}
	}
}
						
plugin:{
	drop_down:{
		data:{
			items: [
				{
					type:"pdf",
					line1:"Effective Date [7/23/2017]",
					line2:"Download PDF",
					icon:"oneui-core-download"
				}
			]
		}
	}
}

plugin:{
	drop_down:{
		element:"drop_down.dashboard-claim",
		data:{
			line1:"02/23/2017",
			line2:"03/18/2016",
			agent:{
				name:"jeff barry",
				phone:"888.335.2722 x256577"
			}
		}
	}
}


plugin:{
	drop_down:{
		data:{
			items: [
				{
					type:"pdf",
					line1:"Effective Date [7/23/2017]",
					line2:"Download PDF",
					icon:"oneui-core-download"
				}
			]
		}
	}
}

plugin:{
	drop_down:{
		data:{
			items: [
				{
					type:"pdf",
					line1:"Effective Date [7/23/2017]",
					line2:"Download PDF",
					icon:"oneui-core-download"
				},
				{
					type:"pdf",
					line1:"Effective Date [7/25/2017]",
					line2:"Download PDF",
					icon:"oneui-core-download"
				},
				{
					type:"pdf",
					line1:"Effective Date [7/25/2017]",
					line2:"Download PDF",
					icon:"oneui-core-download"
				}
			]
		}
	}
}
