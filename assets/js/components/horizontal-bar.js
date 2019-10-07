module.exports = function () {

	return {

		settings: {
			graphicHeight: 400
		},

		init: function () {

			console.log(d3);
			this.addBarGraph();
		},

		addBarGraph: function () {
			
			let self = this;

			var data = [
				{
					'foodType': 'Seafood',
					'amount': 1.48
				},
				{
					'foodType': 'Salt',
					'amount': .11
				},
				{
					'foodType': 'Honey',
					'amount': .1
				},
				{
					'foodType': 'Sugar',
					'amount': .44
				},
				{
					'foodType': 'Alcohol',
					'amount': 32.37
				},
				{
					'foodType': 'Tap Water',
					'amount': 4.24
				},
				{
					'foodType': 'Bottled Water',
					'amount': 94.37
				}
			];
				
			let graphs = document.querySelectorAll('.horizontal-bar');
			
			graphs.forEach(function(graph) {
				
				let graphicContainer = graph.parentElement;
				var padding = {
					top: 60,
					right: 40,
					bottom: 80,
					left: 100
				};
				
				var width = graphicContainer.offsetWidth - padding.left - padding.right;
				var height = self.settings.graphicHeight - padding.top - padding.bottom;
				var barHeight = 5;
				var barMarginTop = 8;
	
				var y = d3.scaleBand().range([height, 0]);
				var x = d3.scaleLinear().range([0, width]);
	
				var svg = d3.select(graph).append('svg')
					.attr('width', width + padding.left + padding.right)
					.attr('height', height + padding.top + padding.bottom)
					.append('g')
					.attr('transform',
						'translate(' + padding.left + ',' + padding.top + ')');
	
				// format the data
				data.forEach(function (d) {
					d.amount = +d.amount;
				});
				
				let compare = function(a, b) {
					return b.amount - a.amount;
				};
				
				data = data.sort(compare);
				
				let maxValue = d3.max(data, function (d) {
					return d.amount;
				});
				
				// Scale the range of the data in the domains
				x.domain([0, (maxValue + maxValue * .05)])
				y.domain(data.map(function (d) {
					return d.foodType;
				}));
	
				svg.selectAll('.bar')
					.data(data)
					.enter().append('rect')
					.attr('class', 'bar')
					.attr('width', function (d) {
						return x(d.amount);
					})
					.attr('y', function (d) {
						return y(d.foodType) + (y.bandwidth() / 2 - barHeight / 2);
					})
					.attr('height', barHeight);
	
				svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
				svg.append('g').call(d3.axisLeft(y).tickSize(0));
				
				// Add graph title
				let title = svg.append('text') 
					.attr('class', 'title')
					.text('Microplastics Found in Human Diet by Food Type');
				let textWidth = title.node().getBBox().width;
				let textHeight = title.node().getBBox().height;
				title.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (-1 * (padding.top/2) + 10) + ')');
				
				
				let xAxisHeight = 20;
				let xAxisLabel = svg.append('text') 
					.attr('class', 'x-axis-label')
					.html('Average Microplastics Per Volume (g/L/m <tspan baseline-shift="super">3</tspan>)');
				textWidth = xAxisLabel.node().getBBox().width;
				textHeight = xAxisLabel.node().getBBox().height;
				xAxisLabel.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (height + xAxisHeight + (padding.bottom/2)) + ')');
			
				// let yAxisLabel = svg.append('text') 
				// 	.attr('class', 'y-axis-label')
				// 	.text('y-axis label here');
				// textWidth = yAxisLabel.node().getBBox().width;
				// textHeight = yAxisLabel.node().getBBox().height;
				// yAxisLabel.attr('transform','translate(' + (-1 * padding.left + textHeight * 2.5) + ', ' + (height/2 + (textWidth/2)) + ') rotate(-90)');
			});
			
		}
	}
}