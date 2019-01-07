$j.build("package")["field.select.names"] = [
	{
		id:"names",
		// arrow:"right",
		label:"Select Driver",
		options:[
			{
				label:"Michael Kelly"
			},
			{
				label:"Taylor Barresi"
			}
		]
	}
	// function(data, config) {
	//
	// }
];

// function(data, config) {
// 	console.log(data)
// },
// NOTE: This is specific to PBE for now
// function build_driver_list() {
// 	var drivers = $j.o("drivers");
// 	console.log(drivers)
// 	var names = [];
// 	$j.each(drivers, function(i, driver) {
// 		names.push({
// 			label: driver.full
// 		})
// 	});
// 	return names;
// }
