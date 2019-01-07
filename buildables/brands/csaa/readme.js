$j.el("papa").fragment("card",{
	title:"credit card"
});

$j.el("papa").fragment("card", [
	{
		title:"credit card"
	},
	{
		title:"address"
	}
])

$j("card form").fragment("fields", 1, function() {
	$j(this)
		.fragment("field.firstName")
		.fragment("field.lastName")
});

$j.el("papa")
	.fragment("card", {
		title:"credit card"
	})
	.fragment("field.creditCard")

$papa
	.fragment("card", {
		id:"forms",
		title:"forms"
	},
	{
		after: function(i, data) {
			$j(this).find("#body").fragment("form", {
				id:"contactInfo"
			})
		}
	})
	.find("card form").fragment("fields", 1, function() {
		$j(this)
			.fragment("field.firstName")
			.fragment("field.lastName")
	});


$papa.build("card.creditCard");
$papa.build("card.address");
$papa.build("card.bankAccount");

$j(this)
	.build("card", {
		title:"New Checking Account"
	})
	.build("form")
	.build("fields")
	.build("field.bank")
	.closest("card");

$papa
	.build("card.withForm", {
		title:"contact info"
	})
	.build("field.firstName")
	.build("field.lastName")
	.build("field.phone")
	.build("field.email")
		
$papa
	.build("card.withForm", {
		title:"contact info"
	})
	.build("field.contactInfo")


$j(this)
	.build("field", data, {
		after: function(i, o) {	
			$j(this)
				.data("field", o)
				.find("#message").build("field.message", o)
		},
		events:{
			after:[
				{
					name:"field"
				}
			]
		}
	});


// CONFIG
/*
	ELEMENT/COMPONENT 
	inclusion & config 

	[
		"pages",
	]

	[
		{
			name:"page",
			component:false,
			extension:true
		},
	]

	[
		{
			name: "menu", 
			component:true,
			methods:{
				build:"build.structure"
			}
		},
	]
*/

