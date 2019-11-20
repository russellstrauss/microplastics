module.exports = function () {
	
	var graphic = document.querySelector('.plastic-longevity .graphic');
	var data;
	var width;
	if (graphic) width = parseInt(graphic.offsetWidth);
	var height = 500;
	var svg;
	var cupWidth, cupHeight;
	var timescaleHeight = 140;
	
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
			self.useRatio();
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
				//console.log(-Math.pow(d.radius, 2.0) * forceStrength)
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
					'category': '',
					'years': 450
				}
			];
				
			let graphs = document.querySelectorAll('.longevity');
			
			graphs.forEach(function(graph) {
				
				let graphicContainer = graph.parentElement;
				var padding = {
					top: 5,
					right: 50,
					bottom: 80,
					left: 100
				};
				
				var width = graphicContainer.offsetWidth - padding.left - padding.right;
				var height = timescaleHeight - padding.top - padding.bottom;
				var barHeight = 15;
	
				var y = d3.scaleBand().range([height, 0]);
				var x = d3.scaleLinear().range([0, width]);
	
				var svg = d3.select(graph).append('svg')
				.attr('width', width + padding.left + padding.right)
				.attr('height', height + padding.top + padding.bottom)
				.append('g')
				.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');
	
				// format the data
				data.forEach(function (d) {
					d.years = +d.years;
				});
				
				let compare = function(a, b) {
					return b.years - a.years;
				};
				
				data = data.sort(compare);
				
				let maxValue = d3.max(data, function (d) {
					return d.years;
				});
				
				// Scale the range of the data in the domains
				x.domain([0, (maxValue + maxValue * .2)])
				y.domain(data.map(function (d) {
					return d.category;
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
						return x(d.years);
					})
					.attr('y', function (d) {
						return y(d.category) + (y.bandwidth() / 2 - barHeight / 2);
					})
					.attr('height', barHeight);
	
				svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
				svg.append('g').call(d3.axisLeft(y).tickSize(0));
			});
		},
		
		useRatio: function() {
			
			let useTimeHours = 4;
			let decomposeYears = 450;
			let decomposeHours = decomposeYears * 8760;
			let ratio = decomposeHours / useTimeHours;
			
			let width;
			let element = document.querySelector('.use-ratio .canvas-holder');
			let message = element.querySelector('.message');
			if (element) {
				width = parseInt(element.offsetWidth);
			}

			var canvas = document.querySelector('#dotCanvas');
			var context = canvas.getContext('2d');
			
			var waypoint = new Waypoint({
				element: element,
				handler: function(direction) {
					
					if (direction === 'down') {
						message.style.marginBottom = '6px';
					}
					else {
						message.style.marginBottom = '-40px';
					}
				},
				offset: -1000
			});
			
			var height = 1200;
			var vw = width, vh = height;
			var dotRadius = 2;
			var cellSize = 5;
			var countPerCanvas;
			
			function resizeCanvas() {
				canvas.width = vw;
				canvas.height = vh;
				countPerCanvas = drawDots();
			}
			resizeCanvas();
			
			function drawDots() {
				
				var count = 0;
				for (var x = dotRadius * 2; x < vw; x += cellSize) {
					
					for (var y = dotRadius * 2; y < vh; y += cellSize) {
						context.beginPath();
						context.arc(x-dotRadius/2, y-dotRadius/2, dotRadius, 0, 2 * Math.PI, false);
						context.fillStyle = '#999';
						context.fill();
						context.strokeStyle = 'black';
						context.lineWidth = 1;
						//context.stroke();
						count++;
					}
				}
				return count;
			}
			
			let canvasCopies = Math.floor(ratio / countPerCanvas);
			for (let i = 0; i < canvasCopies + 1; i++) { // duplicate multiple copies of the canvas to avoid millions of loops
				
				element.append(cloneCanvas(canvas));
				canvas.remove();
			}
			
			function cloneCanvas(oldCanvas) {
				
				var newCanvas = document.createElement('canvas');
				var context = newCanvas.getContext('2d');
				newCanvas.width = oldCanvas.width;
				newCanvas.height = oldCanvas.height;
				context.drawImage(oldCanvas, 0, 0);
				return newCanvas;
			}
			
			window.addEventListener('resize', resizeCanvas, false);
		}
	}
}