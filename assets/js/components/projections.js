
module.exports = function() {
	
	var projectionData, midpointData, higherData, statisticsData, pastData;
	var svg, width, height, chartWidth, chartHeight, padding;
	
	return {
		
		init: function() {
			
			this.loadData();
		},
		
		loadData() {
			
			let self = this;
			
			let preparePast = function(d, i) {
				let row = {};
				row.year = d['Year'];
				row.amount = d['Global plastics production (million tons)'];
				return row;
			};
			
			let prepareMidpoint = function(d) {
				let row = {};
				row.amount2020A = d['MPW Scenario A 2020'];
				row.amount2020B = d['MPW Scenario B 2020'];
				row.amount2020C = d['MPW Scenario C 2020'];
				
				row.amount2040A = d['MPW Scenario A 2040'];
				row.amount2040B = d['MPW Scenario B 2040'];
				row.amount2040C = d['MPW Scenario C 2040'];
				
				row.amount2060A = d['MPW Scenario A 2060'];
				row.amount2060B = d['MPW Scenario B 2060'];
				row.amount2060C = d['MPW Scenario C 2060'];
				
				row.country = d['Country'];
				return row;
			};
				
			d3.csv('./assets/js/data/global-plastics-production.csv', preparePast).then(function(data1) {
				pastData = data1;

				pastData.unshift({'year': '1950', 'amount': 0});
				pastData.push({'year': '2015', 'amount': 0});

				self.lineChart();
				self.addAxes();
			});
		},
		
		lineChart: function() {
			
			let self = this;
			let dataset = pastData;
			
			width = document.querySelector('.projections .plot-container').offsetWidth;
			height = window.innerHeight;
			padding = {top: 50, right: 200, bottom: 100, left: 25};
			chartWidth = width - padding.left - padding.right;
			chartHeight = height - padding.top - padding.bottom;
			
			svg = d3.select('.projections svg')
			.attr('class', 'line-graph')
			.attr('width', width).attr('height', height)
			.append("g")
			.attr("transform", "translate(" + padding.left + "," + padding.top + ")");;

			var xScale = d3.scaleLinear()
			.domain([1950, 2015])
			.range([0, chartWidth]); 
			
			let maxValue = d3.max(dataset, function (d) {
				return +d.amount;
			});
			
			var yScale = d3.scaleLinear()
			.domain([0, maxValue])  
			.range([chartHeight, 0]);
			
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chartHeight + ")")
			.call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
			
			let formatValue = d3.format(".2s");
			
			svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + chartWidth + ", 0)")
			.call(d3.axisRight(yScale).tickFormat(function(d) { return formatValue(d).replace('M', ' million tons'); }));
			
			var line = d3.line()
			.x(function(d, i) { return xScale(d.year); })
			.y(function(d) { 
				//console.log(parseInt(d.amount).toLocaleString(), parseInt(yScale(d.amount)).toLocaleString(), 'max: ', parseInt(maxValue).toLocaleString());
				return yScale(d.amount);
			})
			.curve(d3.curveMonotoneX) // apply smoothing to the line

			svg.append("path")
			.datum(dataset) // binds data to the line 
			.attr("class", "line")
			.attr("d", line); 
			
			let scenarios = ['A', 'B', 'C'];
			
			for (let i = 0; i < 3; i++) {
				
				break; // remove me
				
				let year = 2020 + (i * 20);
				let scenario = 'A';
				
				svg.append('circle')
				.attr('class', 'projection-estimate')
				.attr('cx', function() {
					return xScale(year)
				})
				.attr('cy', function() {
					
					let amount = parseInt(projectionData[0]['amount' + year + scenario]);
					
					yScale(parseInt(projectionData[0]['amount' + year + scenario]));
				})
				.attr('r', '3')
				.attr('fill', 'white');
			}
		},
		
		addAxes: function() {
			
			let title = svg.append('text') 
			.attr('class', 'title')
			.text('Yearly Plastic Production Since 1950');
			let textWidth = title.node().getBBox().width;
			let textHeight = title.node().getBBox().height;
			title.attr('transform','translate(0, ' + (chartHeight - 40) + ')');
			
			let xAxisLabel = svg.append('text') 
			.attr('class', 'x-axis-label')
			.html('metric tons');
			textWidth = xAxisLabel.node().getBBox().width;
			textHeight = xAxisLabel.node().getBBox().height;
			xAxisLabel.attr('transform','translate(' + (chartWidth + 30) + ', ' + (chartHeight + 3) + ')');
		}
	}
}