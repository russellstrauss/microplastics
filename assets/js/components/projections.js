
module.exports = function() {
	
	var settings;
	var lowerData, midpointData, higherData, statisticsData, pastData;
	
	return {
		
		settings: {
			
		},
		
		init: function() {
			
			this.loadData();
		},
		
		loadData() {
			
			let self = this;
			
			let prepareMidpoint = function(d) {
				let row = [];
				row.amount2015 = d['Total municipal plastic waste 2015'];
				row.amount2020 = d['Total municipal plastic waste 2020'];
				row.amount2040 = d['Total municipal plastic waste 2040'];
				row.amount2060 = d['Total municipal plastic waste 2060'];
				row.country = d['Country'];
				
				if (row.country === 'World') return row;
			};
			
			let preparePast = function(d, i) {
				let row = {};
				row.year = d['Year'];
				row.amount = d['Global plastics production (million tons)'] * 1000000;
				return row;
			};
			
			d3.csv('./assets/js/data/global-plastics-production.csv', preparePast).then(function(data1) {
				pastData = data1;
				
				pastData.unshift({'year': '1950', 'amount': 0});
				pastData.push({'year': '2015', 'amount': 0});
				
				console.log('Entire pastData: ', pastData);
				
				self.lineChart();
			});
			
			// d3.csv('./assets/js/data/projections-midpoint.csv', prepareMidpoint).then(function(data1) {
			// 	lowerData = data1;
				
			// 	//console.log(lowerData);
				
			// 	d3.csv('./assets/js/data/projections-midpoint.csv').then(function(data2) {
			// 		midpointData = data2;
					
			// 		d3.csv('./assets/js/data/projections-higher.csv').then(function(data3) {
			// 			higherData = data3;
						
			// 			self.lineChart();
			// 		});
			// 	});
			// });
		},
		
		lineChart: function() {
			
			let self = this;
			
			let dataset = pastData;
			
			let width = document.querySelector('.projections .plot-container').offsetWidth;
			let height = 300;
			
			var svg = d3.select('.projections svg')
			.attr('class', 'line-graph')
			.attr('width', width).attr('height', height);

			// 2. Use the margin convention practice 
			var margin = {top: 50, right: 50, bottom: 50, left: 200};

			// The number of datapoints
			var n = 66;

			// 5. X scale will use the index of our data
			var xScale = d3.scaleLinear()
			.domain([1950, 2060]) // input
			.range([0, width - 300]); // output

			// 6. Y scale will use the randomly generate number 
			var yScale = d3.scaleLinear()
			.domain([0, 381000000 * 1000000]) // input 
			.range([height, 0]); // output 

			// 7. d3's line generator
			var line = d3.line()
			.x(function(d, i) { return xScale(d.year); }) // set the x values for the line generator
			.y(function(d) { return yScale(d.amount); }) // set the y values for the line generator 
			.curve(d3.curveMonotoneX) // apply smoothing to the line

			svg = d3.select(".projections svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// 3. Call the x axis in a group tag
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

			// 4. Call the y axis in a group tag
			svg.append("g")
			.attr("class", "y axis")
			.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

			// 9. Append the path, bind the data, and call the line generator 
			svg.append("path")
			.datum(dataset) // 10. Binds data to the line 
			.attr("class", "line") // Assign a class for styling 
			.attr("d", line); // 11. Calls the line generator 
		}
	}
}