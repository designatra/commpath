1. Break out how data maps (to line 1 or comment)
2. Explain where buildables live
3. Detail capabilities (theme, pills) with possible value
4. Inherited Overrides (like to color or spacing) where variable is set in less
5. HTML
6. Meta + DPL Links
7. Usage
8. Actions, Controls, Fields, Cards

ACTION BLOCKS
---------------------------------------------------------------------------------
	Themeing
	Extensions: 
		Progress Circle
		Pill
		Expandable (items, views)
	Attrs:
		ID
		Class
		Action
		For
---------------------------------------------------------------------------------

1: Focus
	TEXT: Single line

	Dependencies: action, thing, wrapper
	Parents: card
	Buildables: {
		element: "brand",
		component:"brand"
	}

	{
		action: "focus",

		line1: "don't see your policy"
	}


2: Expand > Items 
	TEXT: Two lines
	ICON: Right  arrow

	Dependencies: action, thing, wrapper, item
	Parents: card.mypolicy-proof_of_insurance

	{
		action:"drop_down",

		line1:"auto policy",
		line3:"AZSS800923421",

		plugin: {
			drop_down: {
				data:{
					items:[
						{
							line1: "effective data [7/23/2017]",
							line2: "download PDF",
							icon:"oneui-core-download",
							type:"pdf"
						}
					]
				}
			}
		}
	}


3: Details
	ICON: Large
	TEXT: Two lines

	Dependencies: action, thing, wrapper
	Parents: card.mypolicy-auto_policy
	{
		action:"details",

		icon: "oneui-core-auto",

		line1:"2008 Acura | MDX",
		line2: "VIN: KGTIUYTI46747667"
	}


4: Details
	ICON: Medium + progressCircle (plugin)
	TEXT: One line
	PILL: One line (extension)
	ICON: Right arrow

	Dependencies: action, thing, wrapper, pill
	Parents: card.mypolicy-smarttrek

	{
		icon: {
			class:"oneui-smarttrek",
			plugin: {
				progress_circle:{}
			}
		},

		line1: "2006 Honda Accord",
		pill: {
			state:"bb8",
			label:"check connection"
		},

		isAction = true
	}

4: Inform
	ICON: Large
	TEXT: Two lines 
		     + Comment

	Dependencies: action, thing, wrapper
	Parents: card.mypolicy-claims

	{
		action:"inform",

		icon:"oneui-core-telephone",

		line1:"open a claim",
		line2:"888.335.2722",
		line4: "Thank you for choosing AAA and trusting us with your insurance needs."
	}

5: Expand > View
	ICON: Large
	TEXT: Three lines
		     + Comment
	ICON: Right arrow

	Dependencies: action, thing, wrapper, label, drop_down.dashboard-claim
	Parents: card.mypolicy-claims
	{
		action:"drop_down",

		icon:"oneui-core-auto",

		id:"8739-09-3817",
		status:"open",

		plugin:{
			drop_down:{
				data:{
					agent:{
						name: "francis eppinger",
						phone:"609.519.0703"
					}
				},
				element:"drop_down.dashboard-claim"
			}
		}
	}

6: Launch
	ICON: Large
	PILL: One line (extension)
	(seperator)
	TEXT: Three lines
		     + Comment
	ICON: Right arrow

	Dependencies: action, thing, wrapper, pill
	Parents: card.mypolicy-payments	
	{
		icon: "oneui-core-home",
		pill: {
			label:"Paid by Mortgagee",
			state: "grey-4",
			selector: ">wrapper>wrapper:eq(0)"
		},

		id:"H0565674753247",				( line1 )
		premium: 189,						( line2 )
		date_due:"Due 12/25/2017",		( line3 )
		comment:{							( line4 )
			action:"autopay",
			label:"set up autopay"
		}
	}




