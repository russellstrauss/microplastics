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
	
	var settings = {
		materials: {
			coffee: {
				title: '1 Plastic Coffee Lid',
				path: './assets/svg/coffee.svg',
				useTime: 4,
				mass: '157g',
				breakdownTime: 450
			},
			bottle: {
				title: '1 Plastic Coffee Lid',
				path: './assets/svg/bottle.svg',
				useTime: 4,
				mass: '157g',
				breakdownTime: 450
			},
			vegetable: {
				title: 'Vegetable',
				path: './assets/svg/vegetable.svg',
				useTime: .5,
				mass: '',
				breakdownTime: .2
			}
		}
	}
	
	return {

		init: function () {
 
			this.setUpPlot();
			this.longevityTimescale();
			this.bindUI();
		},

		setUpPlot: function () {
			
			let self = this;

			svg = d3.select(graphic).append('svg').attr('width', width).attr('height', height);
			

			// show center
			//svg.append('circle').attr('class', 'mask').attr('cx', center.x).attr('cy', center.y).attr('r', 10).attr('fill', 'black');
			
			// let cupWidth = 250, cupHeight = 410;
			// let image = svg.append('svg:image')
			// .attr('xlink:href',  './assets/svg/starbucks.svg')
			// .attr('width', cupWidth)
			// .attr('height', cupHeight)
			// .attr('x', center.x - cupWidth / 2)
			// .attr('y', center.y - cupHeight / 2)
			// .attr('class', 'cup');
			
			self.useRatio();
		},
		
		longevityTimescale: function() {
		
			let self = this;
			let generationLength = 76;
			let ratio, remainder;
			let glyph = document.querySelector('.generation-glyphs .frame');

			var data = [
				{
					'category': '',
					'years': 425
				}
			];
				
			let graph = document.querySelector('.longevity');
				
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
			var barWidth = 0;

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
				barWidth = x(d.years);
				ratio = d.years / generationLength;
				remainder = x(d.years % generationLength);
				
				return x(d.years);
			})
			.attr('y', function (d) {
				return y(d.category) + (y.bandwidth() / 2 - barHeight / 2);
			})
			.attr('height', barHeight);
			
			let generations = document.querySelector('.generation-glyphs');
			for (let i = 0; i < Math.ceil(ratio) - 1; i++) {
				generations.append(glyph.cloneNode(true));
			}
			
			let graphicWidth = barWidth / ratio;
			let frames = generations.querySelectorAll('.frame');
			frames.forEach(function(frame) {
				let image = frame.querySelector('img');
				frame.style.width = graphicWidth + 'px';
				image.width = graphicWidth;
			});
			
			frames[frames.length - 1].style.width = remainder - 5 + 'px';

			svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
			svg.append('g').call(d3.axisLeft(y).tickSize(0));
		},
		
		bindUI: function() {
			
			let self = this;
			let selector = document.querySelector('#longevitySelector');			
			if (selector) selector.addEventListener('change', function(event) {
				self.setMaterial(selector.value);
			});
		},
		
		setMaterial: function(materialID) {
			
			let self = this;
			let material = settings.materials[materialID];
			let image = document.querySelector('.plastic-longevity .graphic img');
			if (image) image.setAttribute('src', material.path);
			
			
			let title = document.querySelector('.plastic-longevity .stats .material span');
			let useTime = document.querySelector('.plastic-longevity .stats .use-time span');
			let mass = document.querySelector('.plastic-longevity .stats .mass span');
			let breakdownTime = document.querySelector('.plastic-longevity .stats .generations span');
			
			title.textContent = material.title;
			useTime.textContent = material.useTime;
			mass.textContent = material.mass;
			breakdownTime.textContent = material.breakdownTime;
			console.log(material);
		},
		
		useRatio: function() {
			
			let useTimeHours = 3;
			let decomposeYears = 450;
			let decomposeHours = decomposeYears * 8760;
			let ratio = decomposeHours / useTimeHours;
			let totalCount = 0;
			
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
						message.style.marginBottom = '4px';
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
				var millionCount = 1;
				for (var x = dotRadius * 2; x < vw; x += cellSize) {
					
					for (var y = dotRadius * 2; y < vh; y += cellSize) {
						context.beginPath();
						context.arc(x-dotRadius/2, y-dotRadius/2, dotRadius, 0, 2 * Math.PI, false);
						context.fillStyle = 'rgba(204, 204, 204, .7)';
						context.fill();
						context.strokeStyle = 'white';
						context.lineWidth = 1;
						//context.stroke();
						
						
						if (count === 1000000 * millionCount) {
							console.log(count);
							let result = millionCount + ' millionX longer than you used it'
							element.append(result);
							element.append('test string lkj;lkjdfas;lkj');
							millionCount++;
						}
						count++;
					}
				}
				return count;
			}
			
			let canvasCopies = Math.floor(ratio / countPerCanvas);
			//console.log('Number of canvases: ', canvasCopies);
			for (let i = 0; i < canvasCopies + 1; i++) { // duplicate multiple copies of the canvas to avoid millions of loops
				element.append(cloneCanvas(canvas));
				canvas.remove();
				totalCount += countPerCanvas;
				if (totalCount > 1000000) element.append('1 million times as long as you used it');
			}
			//console.log('Total count: ', totalCount);
			
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