$j.what("buildables", {
	inventory:{
		"action":{
			meta:{
				title:"action",
				description:"",
				tags:["action"],
				dpl:{
					category:"buttons",
					pattern:"action buttons"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{
				siblings:["payments"]
			},
			dependencies:[],
			mock:{
				data:[
					{
						id:"addPayment",
						label:"add payment",
						icon:"oneui-android-add-circle"
					}
				]
			},
			variables:{
				action:{
					id: "id",
					label:{
						content:"label"
					},
					icon:{
						class:"icon"
					}
				}
			}
		},
		"action.block-focus":{
			meta:{
				title:"focus",
				summary:"Single line of text",
				dpl:{
					category:"buttons",
					pattern:"action blocks"
				}
			},
			mock:{
				data: {
					actions:[
						{
							line1:"how do i make a payment?",
							action:"focus"
						}
					]
				}
			}
			// buildable:{
			// 	element:true,
			// 	package:false,
			// 	component:true
			// },
			// relationships:{
			// 	parents:["card"]
			// },
			// dependencies:["action"],
			// mock:{
			// 	data:[
					
			// 	]
			// },
			// variables:{}
			// types: {
			// 	focus:
			// }
		},
		"action.block-expand_items":{
			meta:{
				title:"expand (items)",
				summary:"two lines + arrow",
				dpl:{
					category:"buttons",
					pattern:"action blocks"
				}
			}
		},
		"action.block-expand_view":{
			meta:{
				title:"expand (view)",
				summary:"lg icon, four lines, arrow",
				dpl:{
					category:"buttons",
					pattern:"action blocks"
				}
			}
		},
		"action.block-details":{
			meta:{
				title:"details",
				summary:"lg icon + two lines",
				dpl:{
					category:"buttons",
					pattern:"action blocks"
				}
			}
		},
		"action.block-details_pill":{
			meta:{
				title:"details w/ pill",
				summary:"med icon, one line, & pill",
				dpl:{
					category:"buttons",
					pattern:"action blocks"
				}
			}
		},
		"action.block-inform":{
			meta:{
				title:"inform",
				summary:"icon + three lines",
				dpl:{
					category:"buttons",
					pattern:"action blocks"
				}
			}
		},
		"action.block-launch":{
			meta:{
				title:"launch",
				summary:"lg icon, pill, four lines, arrow",
				dpl:{
					category:"buttons",
					pattern:"action blocks"
				}
			}
		},
		"action.button":{
			meta:{
				title:"action",
				description:"",
				tags:["action", "button"],
				dpl:{
					category:"buttons",
					pattern:"action buttons"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{
				parents:["fields"]
			},
			dependencies:["action"],
			mock:{
				data:[
					{
						class:"secondary",
						label:"cancel"
					},
					{
						class:"primary-blue",
						label:"pay"
					}
				]
			},
			variables:{
				action:{
					id: "id",
					class:"class",	// .primary-yellow, .primary-blue, .secondary, *.disabled
					label:{
						content:"label"
					}
				}
			}
		},
		// "pill":{
		// 	meta:{
		// 		title:"pill",
		// 		summary:"lg icon, pill, four lines, arrow",
		// 		dpl:{
		// 			category:"buttons",
		// 			pattern:"action blocks"
		// 		}
		// 	}
		// },
		"cards":{
			meta:{
				title:"cards",
				description:"",
				tags:["layout"],
				dpl:{
					category:"layout",
					pattern:"cards"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{
				children:["card"]
			},
			dependencies:[],
			mock:{
				data:[]
			},
			variables:{}
		},
		"card":{
			meta:{
				title:"card",
				description:"",
				tags:["layout"],
				dpl:{
					category:"layout",
					pattern:"cards"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{
				parents:["cards"]
			},
			dependencies:[],
			mock:{
				data:[
					{
						id:"makePayment",
						title:"Make or Schedule Payments"
					}
				]
			},
			variables:{
				card:{
					id:"id",
					label: {
						content:"title"
					}
				}
			}
		},
		"field":{
			meta:{
				title:"field",
				description:"",
				tags:["form", "input"],
				dpl:{
					category:"form",
					pattern:"field"
				}
			},
			buildable:{
				element:true,
				package:true,
				component:true
			},
			relationships:{
				parents:["fields"],
				grandparents:["form"]
			},
			dependencies:["message", "field.message", "icon"],
			mock:{
				data:[
					{
						type:"$amount",
						id:"amount-payment",
						label:"Payment Amount",
						format:"$amount",
						error:{
							message:"Enter a payment amount"
						},
						clearable:true
					},
					{
						type: "cc-number",
						id: "ccNumber",
						label: "Credit Card Number",
						format: "cc-number",
						error: {
							message: "Enter a valid credit card number"
						}
					},
					{
						type: "cc-date",
						id: "ccDate",
						label: "Expiration",
						mask: "MM/YYYY",
						error: {
							message: "Invalid"
						}
					},
					{
						type: "email",
						id: "email",
						label: "email",
						error: {
							message: "Enter a valid email address"
						},
						contextual: {
							help: {
								type: "contextual-help",
								message: "A <b>properly formatted</b> email is required to login."
							}
						}
					},
					{
						type: "cc-name",
						id: "ccName",
						label: "Name on Card",
						mask: "John Doe",
						rules: [
							{
								minLength: 3
							},
							{
								maxLength: 40
							}
						],
						error: {
							message: "Enter a valid name"
						}
					}
				]
			},
			variables:{
				field:{
					id:"id",
					type:"type",
					state:"state",
					wrapper:{
						mask:"mask",
						label: {
							content:"label"
						}
					}
					
				}
			}
		},
		"field.message":{
			meta:{
				title:"field messaging",
				description:"Mainly error messaging",
				tags:["form", "feedback"],
				dpl:{
					category:"messaging",
					pattern:"field-level"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{
				grandparents:["field"]
			},
			dependencies:[],
			mock:{
				data:[
					{
						// the following error object is part of the larger field data object
						error:{
							message:"Enter a payment amount"
						}
					}
				]
			},
			variables:{
				message:{
					label: {
						content:"error.message"
					}
				}
			}
		},
		"field.select":{
			meta:{
				title:"drop down",
				description:"",
				tags:["forms", "control"],
				dpl:{
					category:"form",
					pattern:"drop down"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{
				parents:["fields"],
				grandparents:["form"]
			},
			dependencies:["option"],
			mock:{
				data:[
					{
						label:"account",
						options:[
							{
								label:"select account",
								type:"label",
								disabled:"",
								selected:""
							},
							{
								label:"Checking Account: Simple",
								type:"bank-checking"
							},
							{
								label:"Visa: …2121",
								type:"credit-visa"
							},
							{
								label:"New Payment Method",
								type:"account-new"
							}   
						]
					}
				]
			},
			variables:{
				field:{
					wrapper:{
						label: {
							content:"label"
						},
						select:{
							id:"id",
							type:"type"
						}
					}
				}
			}
		},
		"field.option":{
			meta:{
				title:"drop down option",
				description:"naming sort of indicates the option should have a type",
				tags:["control", "forms"],
				dpl:{
					category:"form",
					pattern:"drop down"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{
				parents:["field.select"]
			},
			dependencies:[],
			mock:{
				data:[
					{
						label:"select account",
						type:"label",
						disabled:"",
						selected:""
					},
					{
						label:"Checking Account: Simple",
						type:"bank-checking"
					},
					{
						label:"Visa: …2121",
						type:"credit-visa"
					},
					{
						label:"New Payment Method",
						type:"account-new"
					}
				]
			},
			variables:{
				option:{
					id:"id",
					value:"type",
					disabled:"disabled",
					selected:"selected",
					content:"label"
				}
			}
		},
		"fields":{
			meta:{
				title:"Field Group",
				description:"",
				tags:["organization", "layout", "forms"],
				dpl:{
					category:"form",
					pattern:"field groupings"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{
				parents:["form"]
			},
			dependencies:["field"],
			mock:{
				data:[]
			},
			variables:{}
		},
		"form":{		
			meta:{
				title:"Form",
				description:"",
				tags:["form", "input"],
				dpl:{
					category:"form",
					pattern:"field groupings"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{},
			dependencies:[],
			mock:{
				data:[
					
				]
			},
			variables:{
				form:{
					id:"id",
					type:"type"
				}
			}
		},
		"icon":{
			meta:{
				title:"icon",
				description:"new dpl pattern",
				tags:["decoration"],
				dpl:{
					category:"primatives",
					pattern:"SVG icon"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{},
			dependencies:[],
			mock:{
				data:[
					{
						icon:"oneui-cancel-circled",
						action:"remove"
					},
					{
						icon:"oneui-fill-question",
						action:"contextual-help"
					},
					{
						icon:"oneui-android-add-circle"
					}
				]
			},
			variables:{
				icon: {
					action:"action",
					div: {
						class:"icon" 		// svg="class:icon"
					}
				}
			}
		},
		"message":{			
			meta:{
				title:"Help Message",
				description:"",
				tags:["messaging", "feedback"],
				dpl:{
					category:"help",
					pattern:"field-level"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{
				grandparents:["field"]
			},
			dependencies:[],
			mock:{
				data:[
					
				]
			},
			variables:{
				message: {
					for:"help.type",
					label:{
						content:"help.message"
					}
				}
			}
		},
		"payment":{		
			meta:{
				title:"Scheduled Payment (editable)",
				description:"New dpl pattern - don't know if were actually packaging up the whole row with both it's view and edit states",
				tags:[""],
				dpl:{
					category:"ui",
					pattern:"payment"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{
				parents:["payments"]
			},
			// TODO: think about > "thing" is used and it's style lives in an element, but since it was used inline has no instance id
			dependencies:["field", "icon", "message", "thing"],	
			mock:{
				data:[
					{
						date:"03/28/2017",
						amount:78
					},
					{
						date:"03/25/2017",
						amount:0
					}
				]
			},
			variables:{
				payment: {
					"thing#date":{
						label:{
							content:"date"
						}
					},
					"thing#amount":{
						label:{
							content:"amount"
						}
					}
				}
			}
		},
		"payments":{	
			meta:{
				title:"Scheduling Payments",
				description:"",
				tags:["layout", "form"],
				dpl:{
					category:"ui",
					pattern:"payment"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{},
			dependencies:[],
			mock:{
				data:[]
			},
			variables:{
				
			}
		},
		"thing":{
			meta:{
				title:"thing",
				description:"new dpl pattern category",
				tags:["primatives", "display"],
				dpl:{
					category:"primatives",
					pattern:"thing"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{},
			dependencies:[],
			mock:{
				data:[
					{
						content:"Confirmation will be sent to this email address"
					}
				]
			},
			variables:{
				thing: {
					id:"id",
					class:"class",
					content:"content"
				}
			}
		},
		"ui":{
			meta:{
				title:"User Interface Wrapper",
				description:"Has a lot inside it, so lots of dependencies. Need to evaluate how to handle this overarching wrappers in terms of dependencies. Plus buildables like 'option' would be included when 'field.select' is a dependency",
				tags:["ui", 'layout'],
				dpl:{
					category:"layout",
					pattern:"ui"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:true
			},
			relationships:{},
			dependencies:["ui.payment", "form", "payments", "payment", "field", "icon", "message", "action", "form", "fields", "option", "thing"],
			mock:{
				data:[
					 {
						type:"payment",
						title:"Make or Schedule Payments"
					}
				]
			},
			variables:{
				ui:{
					type:"type",
					wrapper:{
						wrapper:{
							label:{
								content:"title"
							}
						}
					}
				}
			}
		},
		"ui.payment":{	
			meta:{
				title:"Scheduled Payment UI",
				description:"no html in element, just a couple overriding(to el>ui), specific styles. For elements like this, that are slightly different to their base element; does that make it dependent on ui? ",
				tags:["ui", "layout"],
				dpl:{
					category:"ui",
					pattern:"payment"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{},
			dependencies:["ui"],
			mock:{
				data:[
					 {
						type:"payment",
						title:"Make or Schedule Payments"
					}
				]
			},
			variables:{
				
			}
		},
		"form.schedule":{	
			meta:{
				title:"Scheduled Payments ",
				description:"most of the unique schedule payments ui dom structure lives here. Seems obvious that typed elements would depend on their base element.",
				tags:["form", "layout"],
				dpl:{
					category:"ui",
					pattern:"payment"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{},
			dependencies:["payments", "payment", "field", "icon", "message", "action", "form", "fields", "option", "thing", "action"],
			mock:{
				data:[
					{
						policy:{
							icon:"oneui-core-auto",
							number:"AZSS2203108773",
							due:"<b id='amount'>$78</b> due 03/28/2017"
						}
					}
				]
			},
			variables:{
				form: {
					wrapper:{
						wrapper:{
							"wrapper#policy": {
								icon:{
									class:"policy.icon"
								},
								thing:{
									content:"policy.number"
								}
							},
							"wrapper#due":{
								thing: {
									content:"policy.due"
								}
							}
						}
					}
				}
			}
		},
		"form.account-info":{
			meta:{
				title:"User Account Info",
				description:"With typed elements, often the data passed is what creates the new instance of the base element, but with a new name.",
				tags:["form", "layout"],
				dpl:{
					category:"form",
					pattern:"account info"
				}
			},
			buildable:{
				element:true,
				package:false,
				component:false
			},
			relationships:{},
			dependencies:["form", "fields", "field", "option", "message", "icon", "thing", "action"],
			mock:{
				data:[
					{
						type:"account-info"
					}
				]
			},
			variables:{
				
			}
		}	
	}	
});
