module.exports = function () {

	return {

		settings: {
			graphicHeight: 400
		},

		init: function () {

			this.addBarGraph();
		},

		addBarGraph: function () {
			
			let self = this;

			var data = [
				{
					'river': 'Yangtze',
					'countries': ['China'],
					'amount': 3.33e5
				},
				{
					'river': 'Ganges',
					'countries': ['India', 'Bangladesh'],
					'amount': 1.15e5
				},
				{
					'river': 'Xi',
					'countries': ['China'],
					'amount': 7.39e4
				},
				{
					'river': 'Huangpu',
					'countries': ['China'],
					'amount': 4.08e4
				},
				{
					'river': 'Cross',
					'countries': ['Nigeria', 'Cameroon'],
					'amount': 4.03e4
				},
				{
					'river': 'Brantas',
					'countries': ['Indonesia'],
					'amount': 3.89e4
				},
				{
					'river': 'Amazon',
					'countries': ['Brazil', 'Peru', 'Columbia', 'Ecuador'],
					'amount': 3.89e4
				},
				{
					'river': 'Pasig',
					'countries': ['Philippines'],
					'amount': 3.88e4
				},
				{
					'river': 'Irrawaddy',
					'countries': ['Myanmar'],
					'amount': 3.53e4
				},
				{
					'river': 'Solo',
					'countries': ['Indonesia'],
					'amount': 3.25e4
				},
				{
					'river': 'Mekong',
					'countries': ['Thailand', 'Cambodia', 'Laos', 'China', 'Myanmar', 'Vietnam'],
					'amount': 2.28e4
				},
				{
					'river': 'Imo',
					'countries': ['Nigeria'],
					'amount': 2.15e4
				},
				{
					'river': 'Dong',
					'countries': ['China'],
					'amount': 1.91e4
				},
				{
					'river': 'Serayu',
					'countries': ['Indonesia'],
					'amount': 1.71e4
				},
				{
					'river': 'Magdalena',
					'countries': ['Colombia'],
					'amount': 1.67e4
				},
				{
					'river': 'Tamsui',
					'countries': ['Taiwan'],
					'amount': 1.47e4
				},
				{
					'river': 'Zhujiang',
					'countries': ['China'],
					'amount': 1.36e4
				},
				{
					'river': 'Hanjiang',
					'countries': ['China'],
					'amount': 1.29e4
				},
				{
					'river': 'Progo',
					'countries': ['Indonesia'],
					'amount': 1.28e4
				},
				{
					'river': 'Kwa Ibo',
					'countries': ['Nigeria'],
					'amount': 1.19e4
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
				x.domain([0, (maxValue + maxValue * .02)])
				y.domain(data.map(function (d) {
					return d.river;
				}));
	
				svg.selectAll('.bar')
					.data(data)
					.enter().append('rect')
					.attr('class', 'bar')
					.attr('width', function (d) {
						return x(d.amount);
					})
					.attr('y', function (d) {
						return y(d.river) + (y.bandwidth() / 2 - barHeight / 2);
					})
					.attr('height', barHeight);
	
				svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
				svg.append('g').call(d3.axisLeft(y).tickSize(0));
				
				// Add graph title
				let title = svg.append('text') 
					.attr('class', 'title')
					.text('Top 20 Global Rivers Ranked by Ocean Plastic Input');
				let textWidth = title.node().getBBox().width;
				let textHeight = title.node().getBBox().height;
				title.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (-1 * (padding.top/2) + 10) + ')');
				
				let xAxisHeight = 20;
				let xAxisLabel = svg.append('text') 
					.attr('class', 'x-axis-label')
					.html('Mass of Plastic Input in Tons Per Year');
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