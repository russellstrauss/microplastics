module.exports = function () {
	
	var graphic = document.querySelector('.plastic-longevity .graphic');
	var data;
	var width;
	if (graphic) width = parseInt(graphic.offsetWidth);
	var height = 600;
	var svg;
	
	return {

		init: function () {

			this.setUpPlot();
		},

		setUpPlot: function () {
			
			let self = this;

			var data = [
				{
					'river': 'Vegetable',
					'countries': ['China'],
					'amount': .08333
				},
				{
					'river': 'Polypropylene',
					'countries': ['China1'],
					'amount': 450
				},
				{
					'river': 'Wood',
					'countries': ['China2'],
					'amount': 3
				},
				{
					'river': 'Cardboard',
					'countries': ['China2'],
					'amount': .5
				},
			];
			
			let graphicContainer = graphic.parentElement;
			var padding = {
				top: 60,
				right: 40,
				bottom: 80,
				left: 130
			};
			
			var width = graphicContainer.offsetWidth - padding.left - padding.right;
			var innerHeight = height - padding.top - padding.bottom;
			var barHeight = 5;

			var y = d3.scaleBand().range([innerHeight, 0]);
			var x = d3.scaleLinear().range([0, width]);

			svg = d3.select(graphic).append('svg')
				.attr('width', width + padding.left + padding.right)
				.attr('height', innerHeight + padding.top + padding.bottom)
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

			svg.append('g').attr('transform', 'translate(0,' + (innerHeight + 6) + ')').call(d3.axisBottom(x));
			svg.append('g').call(d3.axisLeft(y).tickSize(0));
			
			// Add graph title
			let title = svg.append('text') 
				.attr('class', 'title')
				.text('Plastic Longevity');
			let textWidth = title.node().getBBox().width;
			let textHeight = title.node().getBBox().height;
			title.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (-1 * (padding.top/2) + 10) + ')');
			
			let xAxisHeight = 20;
			let xAxisLabel = svg.append('text') 
				.attr('class', 'x-axis-label')
				.html('Decomposition Time');
			textWidth = xAxisLabel.node().getBBox().width;
			textHeight = xAxisLabel.node().getBBox().height;
			xAxisLabel.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (innerHeight + xAxisHeight + (padding.bottom/2)) + ')');
		
			let yAxisLabel = svg.append('text') 
				.attr('class', 'y-axis-label')
				.text('Material');
			textWidth = yAxisLabel.node().getBBox().width;
			textHeight = yAxisLabel.node().getBBox().height;
			yAxisLabel.attr('transform','translate(' + (-1 * padding.left + textHeight * 2.5) + ', ' + (innerHeight/2 + (textWidth/2)) + ') rotate(-90)');
			
			self.circles();
		},
		
		circles: function() {
			
			var rawData = [];
			for (let i = 0; i < 500; i++) {
				rawData.push({ x: 0, y: 0, radius: 5});
			}

			var center = {
				x: width / 4,
				y: height / 2
			};
			
			console.log(center, width, height);

			var forceStrength = 0.03;
			var bubbles = null;

			function charge(d) {
				return -Math.pow(d.radius, 2.0) * forceStrength;
			}

			var simulation = d3.forceSimulation()
			.velocityDecay(0.2)
			.force('x', d3.forceX().strength(forceStrength).x(center.x))
			.force('y', d3.forceY().strength(forceStrength).y(center.y))
			.force('charge', d3.forceManyBody().strength(charge))
			.on('tick', ticked);

			simulation.stop();

			var fillColor = d3.scaleOrdinal()
			.domain(['low', 'medium', 'high'])
			.range(['#d84b2a', '#beccae', '#7aa25c']);

			var myNodes = rawData.map(function (d) {
				return {
					radius: 5,
					x: Math.random() * 900,
					y: Math.random() * 800
				};
			});

			bubbles = svg.selectAll('.bubble')
			.data(myNodes);

			var bubblesE = bubbles.enter().append('circle')
			.classed('bubble', true)
			.attr('r', 0)
			.attr('fill', function (d) {
				return 'red';
			})
			.attr('stroke', function (d) {
				return 'black';
			})
			.attr('stroke-width', 2);

			bubbles = bubbles.merge(bubblesE);

			bubbles.transition()
			.duration(2000)
			.attr('r', function (d) {
				return d.radius;
			});
			simulation.nodes(myNodes);
			simulation.force('x', d3.forceX().strength(forceStrength).x(center.x)); // @v4 Reset the 'x' force to draw the bubbles to the center.
			simulation.alpha(1).restart(); // @v4 We can reset the alpha value and restart the simulation

			function ticked() {
			
				bubbles.attr('cx', function (d) {
					return d.x;
				})
				.attr('cy', function (d) {
					return d.y;
				});
			}
		}
	}
}