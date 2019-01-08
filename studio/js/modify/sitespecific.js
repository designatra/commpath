function pageBuilder(){
	var $papa = $j(this);

}

function buildVis() {
	// create an array with nodes
	var nodes = new vis.DataSet([
		{id: 1, label: 'A'},
		{id: 2, label: 'B'},
		{id: 3, label: 'C'},
		{id: 4, label: 'D'}
	]);

	// create an array with edges
	var edges = new vis.DataSet([
		{from: 1, to: 2, arrows:'to'},
		{from: 2, to: 3, arrows:{
				to: {
					enabled: true,
					type: 'circle'
				}
			}},
		{from: 3, to: 4, arrows:{
				to: {
					enabled: true,
					type: 'bar'
				}
			}},
	]);

	// create a network
	var container = document.getElementById('mynetwork');
	var data = {
		nodes: nodes,
		edges: edges
	};

	var options = {
		/*
        // Enable this to make the endpoints smaller/larger
        edges: {
          arrows: {
            to: {
              scaleFactor: 5
            }
          }
        }
    */
	};

	var network = new vis.Network(container, data, options);
}
