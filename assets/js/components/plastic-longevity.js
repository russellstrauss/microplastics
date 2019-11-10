module.exports = function () {
	
	var graphic = document.querySelector('.plastic-longevity .graphic');
	var data;
	var width;
	if (graphic) width = parseInt(graphic.offsetWidth);
	var height = 600;
	var svg;
	var cupWidth, cupHeight;
	
	console.log(width);
	
	var center = {
		x: width / 2,
		y: height / 2
	};
	
	return {

		init: function () {

			this.setUpPlot();
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
			.velocityDecay(0.1)
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
			//.attr('opacity', 0)
			.attr('stroke-width', 1);
			
			var updateParticles = function() {

				
				nodeEnter = nodeG.selectAll('.node')
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
				//nodeEnter.attr('opacity', 1);
			});
			
			simulation.nodes(particles).on('tick', tickSimulation);
			
			var done = false;
			function tickSimulation() {

				nodeEnter.attr('cx', function(d) { return d.x;})
				.attr('cy', function(d) { return d.y;});
			}
		},
		
		longevityTimescale: function() {
			
		}
	}
}