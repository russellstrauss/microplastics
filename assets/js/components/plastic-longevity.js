module.exports = function () {
	
	var graphic = document.querySelector('.plastic-longevity .graphic');
	var data;
	var width;
	if (graphic) width = parseInt(graphic.offsetWidth);
	var height = 500;
	var svg;
	var cupWidth, cupHeight;
	var timescaleHeight = 200;
	
	var center = {
		x: width / 2,
		y: height / 2
	};
	
	return {

		init: function () {

			this.setUpPlot();
			this.longevityTimescale();
		},

		setUpPlot: function () {
			
			let self = this;

			svg = d3.select(graphic).append('svg').attr('width', width).attr('height', height);
			

			// show center
			//svg.append('circle').attr('class', 'mask').attr('cx', center.x).attr('cy', center.y).attr('r', 10).attr('fill', 'black');
			
			let cupWidth = 250, cupHeight = 410;
			let image = svg.append('svg:image')
			.attr('xlink:href',  './assets/svg/starbucks.svg')
			.attr('width', cupWidth)
			.attr('height', cupHeight)
			.attr('x', center.x - cupWidth / 2)
			.attr('y', center.y - cupHeight / 2)
			.attr('class', 'cup');
			
			self.particles();
		},
		
		particles: function() {
			var colorScale = d3.scaleSequential(d3.interpolateViridis);
			var network;
			
			var particles = [];
			for (let i = 0; i < 1000; i++) {
				particles.push({ 
					x: Math.random() * width,
					y: Math.random() * height,
					// x: 0,
					// y: 0,
					radius: i%3 + 2
				});
			}
			
			var nodeG = svg.append('g').attr('class', 'nodes-group');
			
			var forceStrength = .1;
			function charge(d) {
				console.log(-Math.pow(d.radius, 2.0) * forceStrength)
				return -Math.pow(d.radius, 2.0) * forceStrength;
			}
			
			var simulation = d3.forceSimulation()
			.velocityDecay(0.03)
			//.force('charge', charge)
			.force('charge', d3.forceManyBody().strength(-.5))
			.force('repelForce', d3.forceManyBody().strength(-1).distanceMax(10).distanceMin(5))
			.force('center', d3.forceCenter(center.x, center.y));
			
			var nodeEnter = nodeG.selectAll()
			.data(particles)
			.enter()
			.append('circle')
			.attr('class', 'node')
			.attr('r', function(d) { return d.radius;})
			.attr('fill', function (d) {
				return 'rgb(200, 200, 200)';
			})
			.attr('stroke', function (d) {
				return 'rgba(0, 0, 0, .5)';
			})
			.attr('opacity', 0)
			.attr('stroke-width', 1);
			
			var updateParticles = function() {

				nodeEnter = nodeG.selectAll('.node')
				.transition().duration(500) // remove me
				.attr('opacity', 1)
				.data(particles)
				.merge(nodeEnter);
				
				nodeEnter.exit().transition().remove();
				// Update and restart the simulation.
				simulation.nodes(nodeEnter);
				simulation.alpha(1).restart();
			};
			
			svg.on('click', function() {
				simulation.force('repelForce', d3.forceManyBody().strength(-1).distanceMax(2).distanceMin(1));
				
				particles = [];
				for (let i = 0; i < 1000; i++) {
					particles.push({ 
						x: Math.random() * width,
						y: Math.random() * height,
						radius: i%3 + 2
					});
				}
				
				updateParticles();
				
				svg.select('.cup').attr('opacity', 0);
			});
			
			simulation.nodes(particles).on('tick', tickSimulation);
			
			var done = false;
			function tickSimulation() {

				nodeEnter.attr('cx', function(d) { return d.x;})
				.attr('cy', function(d) { return d.y;});
			}
		},
		
		longevityTimescale: function() {
		
			let self = this;

			var data = [
				{
					'river': 'polypropylene',
					'countries': ['Indonesia'],
					'amount': 450
				}
			];
				
			let graphs = document.querySelectorAll('.longevity');
			
			graphs.forEach(function(graph) {
				
				let graphicContainer = graph.parentElement;
				var padding = {
					top: 60,
					right: 50,
					bottom: 80,
					left: 100
				};
				
				var width = graphicContainer.offsetWidth - padding.left - padding.right;
				var height = timescaleHeight - padding.top - padding.bottom;
				var barHeight = 20;
	
				var y = d3.scaleBand().range([height, 0]);
				var x = d3.scaleLinear().range([0, width]);
	
				var svg = d3.select(graph).append('svg')
				.attr('width', width + padding.left + padding.right)
				.attr('height', height + padding.top + padding.bottom)
				.append('g')
				.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');
	
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
				
				let xAxisHeight = 20;
				let xAxisLabel = svg.append('text') 
					.attr('class', 'x-axis-label')
					.html('Years to Break Down');
				let textWidth = xAxisLabel.node().getBBox().width;
				let textHeight = xAxisLabel.node().getBBox().height;
				xAxisLabel.attr('transform','translate(' + (width/2 - textWidth) + ', ' + (height + xAxisHeight + (padding.bottom/2)) + ')');
			
	
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
			});
		}
	}
}