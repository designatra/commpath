// UTILITY PATTERNS
// -------------------------------------------------------------------------------------------

/*
	INITIAL FRAGMENT SETUP
	Imports and setups inventory of fragments

	1. Import fragments (via node service)
		$j.fragment("import", function(fragments) {
			$j.log(fragments)
		})
	
	2. Processes imported json by:
		a. Adding each fragment's style tag to <head>
		b. Create buffered DOM from html (in memory)
*/
$j.fragment("setup", function(inventory) {
	$j.log(inventory)
});

/*
	Returns a cloned $j(fragment) element from memory
*/
$j.fragment("$", "item");

/*
	Returns all fragments in inventory	
*/
$j.fragment("inventory")

/*
	Returns all components or a specified component 
*/
$j.fragment("component")
$j.fragment("component", "card.emergency")

/*
	Returns usage statistics on all fragments & compoents
*/
$j.fragment("usage")

/*
	Returns all of an extension's methods
*/
$j.fragment("card")


// COMMOM USAGE PATTERNS
// -------------------------------------------------------------------------------------------

/*
	ONE or TWO parameters:
	1. * Name (string) 
	2. Quantity (integer)
	    or After Callback (function)
*/
$j.el("papa").fragment("item");

$j.el("papa").fragment("item", 10);

$j.el("papa").fragment("item", function() {
	$j.log("after", $j(this))
});

/*
	THREE parameters:
	1. * Name (string) 
	2. * Data ([array] or {object}), Quantity (integer)
	3. * After Callback (function)
*/
$j.el("papa").fragment("item", 10, function() {
	$j.log("after", $j(this))
});

$j.el("papa").fragment("item",
	[{
		label:"dog"
	},
	{
		label:"cat"
	}], 
	function(i, data) {
		$j.log("after", i, $j(this), data)
	}
);

/*
	THREE parameters:
	1. Name (string) 
	2. Data ([array] or {object}), Quantity (integer)
	3. Parameter's object > { callbacks, additional Parameters }
*/
$j.el("papa").fragment("item",
	[{
		label:"dog"
	},
	{
		label:"cat"
	}], 
	{
		insert:"before",
		populate: function(i, data) {
			$j.log("populate", i, data);
		},
		completed: function(data){
			$j.log("completed", $j(this), data)
		}
	}
);

/*
	Creates ONE fragment
*/
$j.el("papa").fragment({
	name:"item"
})

/*
	Creates specified quantity of fragments > creates FIVE fragments
*/
$j.el("papa").fragment({
	name:"item",
	data:5
})

/*
	Wraps object in array > Creates ONE fragment
*/
$j.el("papa").fragment({
	name:"item",
	data:{
		name:"michael",
		age:34
	}
})

/*
	Creates fragment for each object in passed array  > creates TWO fragments
*/
$j.el("papa").fragment({
	name:"item",
	data:[
		{
			name:"parrot",
			type:"animal"
		},
		{
			name:"dog",
			type:"animal"
		}
	]
});

// EVENTS
// -------------------------------------------------------------------------------------------

/*

	If events have been registered to run after-after() callback. May come in multiple forms:
	1. string
	2. object
	3. array
*/

/*
	Event named > "test1" will be bound to the new fragment, AFTER each fragment is added to page
*/
$j.el("papa").fragment("item", 4, {
	events:{
		after:"test1"
	}
})

/*
	Events named > "test1" & "test2" will each be bound to the new fragment, AFTER each fragment is added to page
*/
$j.el("papa").fragment("item", 3, {
	events:{
		after:["test1", "test2"]
	}
})

/*
	Event named > "test1" will be bound to the papa element, AFTER each fragment is added to page
*/
$j.el("papa").fragment("item", 1, {
	events:{
		after:{
			$:"body > papa",
			name:"test1"
		}
	}
})

/*
	1a. Event named > "test1" will be bound to the papa element, 
	1b. Event named > "test2" will be bound to the new fragment,
		    >> AFTER each new "item" fragment is added to page
	2. Event named > "test3" will be bound to the last element,
		   >>  when all fragments have (COMPLETED) been added to page 
*/
$j.el("papa").fragment("item", 1, {
	name:"item",
	data:[
		{
			name:"parrot",
			type:"animal"
		},
		{
			name:"dog",
			type:"animal"
		}
	],
	events:{
		after:[
			{
				$:"body > papa",
				name:"test1"
			},
			{
				name:"test2"
			}
		],
		completed: "test3"
	}
});


// PLUGINS
// -------------------------------------------------------------------------------------------

/*

	If a plugin or a list of plugins is specified (including init params) to run after each fragment 
	PROCESS PIPING > runs after event init (after() THEN after events THEN plugins init)
	
	If an object is passed, the key > "$" allows a custom selector to be passed

*/

/*
	Plugin named > "draggable" will be bound to the new fragment, AFTER each fragment is added to page 
	
	Plugin name may be specified as a(n):
	1. String
	2. Object > keyed {"name": ...}
*/
$j.el("papa").fragment("donald", 4, {
	plugins: {
		after:"draggable"
	}
});

$j.el("papa").fragment("donald", 3, {
	plugins:{
		after:{
			name:"draggable"
		}
	}
});

/*
	Plugins named > "draggable" & "droppable" will each be bound to the new fragment, AFTER each fragment is added to page
*/
$j.el("papa").fragment("donald", 1, {
	plugins:{
		after:["draggable", "droppable"]
	}
});

$j.el("papa").fragment("donald", 1, {
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
});

/*
	1a. Plugin named > "draggable" will be bound to the new fragment, 
	1b. Plugin named > "droppable" will be bound to the new fragment,
		    >> AFTER each new "item" fragment is added to page
	2. Plugin named > "droppable" will be bound to the action blocks for each site,
		   >>  when all fragments have (COMPLETED) been added to page 
*/

$j.el("papa").fragment("donald", 1, {
	plugins:{
		after:[
			{
				name:"draggable"
			},
			{
				name:"droppable"
			}
		],
		completed:{
			$:"#sites action",
			name:"draggable"
		}
	}
});

$j.el("papa").fragment("donald", 1, {
	plugins:{
		after:[
			{
				name:"draggable"
			},
			{
				name:"droppable"
			}
		],
		completed:[
			{
				$:"#sites action",
				name:"draggable"
			},
			{
				$:"#sites action",
				name:"droppable"
			}
		]
	}
});

$j.el("papa").fragment("donald", [
		{
			name:"parrot",
			type:"animal"
		},
		{
			name:"dog",
			type:"animal"
		}
	], 
	{
		insert:"before",
		populate: function(i, data) {
			$j.log("populate donald", i, data);
		},
		completed: function(data){
			$j.log("completed donald", $j(this), data)
		},
		events:{
			after:[
				{
					$:"body > papa",
					name:"test1"
				},
				{
					name:"test2"
				}
			],
			completed: "test3"
		},
		plugins:{
			after:[
				{
					name:"draggable"
				},
				{
					name:"droppable"
				}
			],
			completed:[
				{
	                		$:"#sites action",
	      				name:"draggable"
	            		},
				{
	                		$:"#sites action",
	                		name:"droppable"
	            		}
			]
		}
	}
);


// POPULATION
// -------------------------------------------------------------------------------------------

/*
	TERMINOLOGY
	Auto populates new fragment on each iteration using respective data or data modified within the populate callback	
	1. content
	2. media (soon to be css)
	3. attr
	4. svg


	1. CONTENT:
		content="recommendation.name"
		content="alert.action.message&populate"

	2. MEDIA:
		media="backgroundImage:recommendation.image"

	3. ATTR:
		attr="id:alert.action.id"
		attr="class:alert.action.icon,id:alert.id"
		attr="class:alert.action.icon||alert.message.icon"

	4. SVG
		<div svg="class:icon"></div>  OR <icon><div svg="class:icon"></div></icon>
			BECOMES (original el with SVG attr is replaced)
				<svg class="arrow-38"><use xlink:href="#arrow-38"></use></svg>
*/

/*
	Manually populate product element and any decendant with the data contained in passed object
*/
$j("product").fragment("populate", {
	description: "Sugar-Free Drink Sticks come in four delicious flavors",
	name: "Acai Lemonade Stevia Drink Sticks",
	price: "5.99",
	upc: 733739069924,
});


// config.js
// -------------------------------------------------------------------------------------------

configs.fragments = [
		"pages", 
		"  ... ",
	]

configs.fragments = [
	{
		name:"page",
		component:false,
		extension:true
	},
	{ ... }
]

configs.fragments = [
	{
		name: "menu", 
		component:true,
		methods:{
			build:"build.structure"
		}
	},
	{ ... }
]
