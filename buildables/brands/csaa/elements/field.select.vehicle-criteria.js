$j.build("package")["field.select.vehicle-criteria"] = [
	{
		label:"year",
		options:{
			generate:{
				years:[1975, 2017]
			}
		}
	},
	{
		label:"make",
		options:[{label:"acura"},{label:"aston martin"},{label:"audi"},{label:"bentley"},{label:"bmw"},{label:"buick"},{label:"cadillac"},{label:"chevrolet"},{label:"chrysler"},{label:"dodge"},{label:"ferrari"},{label:"ford"},{label:"gmc"},{label:"honda"},{label:"hummer"},{label:"hyundai"},{label:"infiniti"},{label:"isuzu"},{label:"jaguar"},{label:"jeep"},{label:"kia"},{label:"lamborghini"},{label:"land rover"},{label:"lexus"},{label:"lincoln"},{label:"lotus"},{label:"maserati"},{label:"maybach"},{label:"mazda"},{label:"mercedes-benz"},{label:"mercury"},{label:"mini"},{label:"mitsubishi"},{label:"nissan"},{label:"pontiac"},{label:"porsche"},{label:"rolls-royce"},{label:"saab"},{label:"saturn"},{label:"subaru"},{label:"suzuki"},{label:"toyota"},{label:"volkswagen"},{label:"volvo"}]
	},
	{
		label:"model",
		options:[{label:"commander"},{label:"compass"},{label:"grand cherokee"},{label:"liberty"},{label:"patriot"},{label:"wrangler"}]
	},
	{
		label:"trim / style",
		options:[
			{
				label:"limited"
			},
			{
				label:"unlimited"
			},
			{
				label:"sport"
			},
			{
				label:"renegade"
			}
		]
	},
	function(data, config) {
		config.completed = function(o) {
			$j(this)
				.parent().build("thing", {
					id:"description",
					content:"If you decide to add this vehicle to your policy, you will be asked to provide the VIN when you pay for your updated policy."
				});
		}

		return $j(this)
	}
];
