module.exports = function () {
	
	var svg = d3.select('.scatterplot svg');
	let padding = {
		top: 100,
		left: 120,
		right: 100,
		bottom: 100
	}
	let width = window.innerWidth- padding.right;
	let height = 800;
	var toolTip;
	
	return {

		settings: {
			
		},

		init: function () {

			this.toolTip();
			this.scatterplot();
		},

		scatterplot: function() {
			//./assets/js/data/surface-ocean-particle-count.csv
			d3.csv('./assets/js/data/exoplanets.csv').then(function(dataset) {
				
				//./assets/js/data/surface-ocean-particle-count.csv
				// let xExtent = 'habital_zone_distance';
				// let yExtent = 'mass';
				// let radiusExtent = 'radius';
				let xExtent = 'habital_zone_distance';
				let yExtent = 'mass';
				let radiusExtent = 'radius';
				
				let circle = svg.selectAll('circle').data(dataset).enter().append('circle');
				circle.attr('class', 'planet');
				circle.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

				svg.attr('height', height);
				let maxRadius = 20;
				
				let colorDomain = d3.extent(dataset, function(d) {
					return +d[xExtent];
				});
				let mass = d3.extent(dataset, function(d) {
					return +d[yExtent];
				});
				let radiusDomain = d3.extent(dataset, function(d) {
					return +d[radiusExtent];
				});
				let xScale = d3.scaleLinear().domain(colorDomain).range([padding.left + 10, width]);
				let yScale = d3.scaleLog().domain(mass).range([padding.top, height - padding.bottom - 16]);
				let radiusScale = d3.scaleSqrt().domain(radiusDomain).range([1, maxRadius]);
				let colorScale = d3.scaleQuantize().domain(colorDomain).range(['#FF3300', '#29AD37', '#27EFFF']);
				
				
				// Set circle size
				circle.attr('cx', function(d) {
					return xScale(d[xExtent]);
				});
				
				circle.attr('cy', function(d) {
					return yScale(d[yExtent]);
				});
				
				circle.attr('r', function(d) {
					return radiusScale(d[radiusExtent]);
				});
				
				circle.attr('fill', function(d) {
					return colorScale(d[xExtent]);
				});
			
				// Add habitable zone x-axis
				svg.append('g').attr('class', 'x-axis')
				.attr('transform', 'translate(0, ' + (height - padding.bottom) +')')
				.call(d3.axisBottom(xScale).tickFormat(function(d) {
					return d;
				}));
				svg.append('g').attr('class', 'x-axis')
				.attr('transform', 'translate(0, ' + (padding.top - maxRadius).toString() +')')
				.call(d3.axisBottom(xScale).tickFormat(function(d) {
					return d;
				}));
				
				
				// Add mass y-axis
				svg.append('g').attr('class', 'y-axis')
				.attr('transform', 'translate(' + parseInt(padding.left - 8) + ', 0)')
				.call(d3.axisLeft(yScale));
				svg.append('g').attr('class', 'y-axis')
				.attr('transform', 'translate(' + (width + maxRadius).toString() + ', 0)')
				.call(d3.axisLeft(yScale));
				
				// Label x-axis
				var xAxisLabel = svg.append('text').attr('class', 'label').text('Year?');
				xAxisLabel.attr('transform','translate(' + (width/2 - xAxisLabel.node().getBBox().width/2).toString() + ',' + (height - padding.bottom + 60).toString() +')')
				// // Label y-axis
				var yAxisLabel = svg.append('text').attr('class', 'label').text('Y-Axis');
				yAxisLabel.attr('transform','translate(' + parseInt(padding.left - 50) + ',' + (height/2 + yAxisLabel.node().getBBox().width/2).toString() + ') rotate(-90)')
			
				// // Add graph title
				var title = svg.append('text').attr('class', 'title').text('Title');
				title.attr('transform','translate(' + (width/2 - title.node().getBBox().width/2).toString() + ', 50)')
			});
		},
		
		toolTip: function() {
			
			toolTip = d3.tip()
			.attr("class", "d3-tip")
			.offset([-12, 0])
			.html(function(d) {
				return '<div class="tooltip"><h5>'+d['name']+"</h5></div>"
			});
			svg.call(toolTip);
		}
	}
}