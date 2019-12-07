module.exports = function () {
	
	var graphic = document.querySelector('.plastic-longevity .graphic');
	var data = [{ 'years': 450 }];
	var width;
	if (graphic) width = parseInt(graphic.offsetWidth);
	var height = 500;
	var svg;
	var cupWidth, cupHeight;
	var timescaleHeight = 140;
	var canvas = document.querySelector('#dotCanvas');
	var canvasHolder = document.querySelector('.plastic-longevity .canvas-holder');
	var draggerTransform = 0;
	var previousDraggerTransform = 0;
	var totalCount = 0;
	var unitVisContainer = document.querySelector('.plastic-longevity .unit-vis-viewport');
	var message = document.querySelector('.plastic-longevity .message');
	var countElement = document.querySelector('.use-ratio .count');
	let generationLength = 76;
	
	var center = {
		x: width / 2,
		y: height / 2
	};
	
	var settings = {
		materials: {
			bottle: {
				title: '1 Plastic Bottle',
				path: './assets/svg/bottle.svg',
				useTimeHours: 1,
				useTimeDisplay: '1 hour',
				mass: '24g',
				breakdownTime: 450,
				breakdownTimeDisplay: '450 years'
			},
			coffee: {
				title: '1 Plastic Coffee Lid',
				path: './assets/svg/coffee.svg',
				useTimeHours: 2,
				useTimeDisplay: '2 hours',
				mass: '4.48g',
				breakdownTime: 425,
				breakdownTimeDisplay: '425 years'
			},
			vegetable: {
				title: 'Vegetable',
				path: './assets/svg/vegetable.svg',
				useTimeHours: 2,
				useTimeDisplay: '2 hours',
				mass: '',
				breakdownTime: .246575,
				breakdownTimeDisplay: '3 months'
			},
			cardboard: {
				title: 'Cardboard',
				path: './assets/img/cardboard.png',
				useTimeHours: 72,
				useTimeDisplay: '3 days',
				mass: 'Variable',
				breakdownTime: .249315,
				breakdownTimeDisplay: '3 months'
			}
		}
	}
	
	return {

		init: function () {
			
			this.useRatio(settings.materials['bottle'].useTimeHours, settings.materials['bottle'].breakdownTime);
			this.longevityTimescale();
			this.bindUI();
			this.miniMap();
			this.setMaterial('bottle');
		},
		
		longevityTimescale: function() {
		
			let self = this;
			let ratio, remainder;
			let glyph = document.querySelector('.generation-glyphs .frame');
				
			let graph = document.querySelector('.longevity');
			let graphicContainer = graph.parentElement;
			var padding = {
				top: 5,
				right: 50,
				bottom: 80,
				left: 20
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
			x.domain([0, (maxValue + maxValue * .2)]);
			
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
			.attr('height', barHeight);
			
			let generations = document.querySelector('.generation-glyphs');
			for (let i = 0; i < Math.ceil(ratio) - 1; i++) {
				generations.append(glyph.cloneNode(true));
			}
			
			let graphicWidth = barWidth / ratio;
			let frames = generations.querySelectorAll('.frame');
			if (frames.length) {
				
				frames.forEach(function(frame) {
					let image = frame.querySelector('img');
					frame.style.width = graphicWidth + 'px';
					image.width = graphicWidth;
				});
				
				frames[frames.length - 1].style.width = remainder - 5 + 'px';
			}

			svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
			svg.append('g').call(d3.axisLeft(y).tickSize(0));
		},
		
		bindUI: function() {
			
			let self = this;
			let selector = document.querySelector('#longevitySelector');			
			if (selector) selector.addEventListener('change', function(event) {
				self.setMaterial(selector.value);
				canvasHolder.innerHTML = '';
				self.useRatio(settings.materials[selector.value].useTimeHours, settings.materials[selector.value].breakdownTime);
				
				let newYear = settings.materials[selector.value].breakdownTime;
				data = [{ 'years': newYear }];
				if (newYear < 1) {
					document.querySelector('.longevity').innerHTML = '';
					document.querySelector('.generation-glyphs').innerHTML = '';
					self.longevityTimescale();
				}
				else {
					document.querySelector('.longevity').innerHTML = '';
					document.querySelector('.generation-glyphs').innerHTML = '<div class="frame"><img src="./assets/svg/generation-white.svg" alt="generation icon"></div>';
					self.longevityTimescale();
				}
			});
		},
		
		setMaterial: function(materialID) {
			
			let self = this;
			let material = settings.materials[materialID];
			let image = document.querySelector('.plastic-longevity .graphic img');
			if (image) {
				image.classList = '';
				image.classList.add(materialID);
				image.setAttribute('src', material.path);
			}
			
			let title = document.querySelector('.plastic-longevity .stats .material span');
			let useTime = document.querySelector('.plastic-longevity .stats .use-time span');
			//let mass = document.querySelector('.plastic-longevity .stats .mass span');
			let breakdownTime = document.querySelector('.plastic-longevity .stats .generations span');
			let lifetimes = document.querySelector('.plastic-longevity .stats .lifetimes span');
			
			title.textContent = material.title;
			useTime.textContent = material.useTimeDisplay;
			//mass.textContent = material.mass;
			breakdownTime.textContent = material.breakdownTimeDisplay;
			let lifetimesValue = material.breakdownTime / 76;
			if (lifetimesValue < 1) lifetimesValue = lifetimesValue.toFixed(3);
			else { 
				lifetimesValue = lifetimesValue.toFixed(1);
			}
			lifetimes.textContent = lifetimesValue.toString() + ' lifetimes';
			
			let averageUseTimeElement = document.querySelector('.baseline span');
			averageUseTimeElement.textContent = '(' + material.useTimeDisplay + ')';
		},
		
		useRatio: function(useTimeHours, decomposeYears) {
			
			let hoursInAYear = 8760;
			let decomposeHours = decomposeYears * hoursInAYear;
			let ratio = decomposeHours / useTimeHours;
			
			let width;
			let element = document.querySelector('.use-ratio .canvas-holder');

			if (element) {
				width = parseInt(element.offsetWidth);
			}

			var context = canvas.getContext('2d');
			
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
				totalCount = 0;
				for (var x = dotRadius * 2; x < vw; x += cellSize) {
					
					for (var y = dotRadius * 2; y < vh; y += cellSize) {
						context.beginPath();
						context.arc(x-dotRadius/2, y-dotRadius/2, dotRadius, 0, 2 * Math.PI, false);
						context.fillStyle = 'rgba(255, 255, 255, .4)';
						context.fill();
						count++;
					}
				}
				return count;
			}
			
			let yearsPerCanvas = useTimeHours * countPerCanvas / hoursInAYear;
			let searchingFor = generationLength;
			
			let canvasCopies = Math.floor(ratio / countPerCanvas);
			let generationCount = 1;
			for (let i = 0; i < canvasCopies + 1; i++) { // duplicate multiple copies of the canvas to avoid millions of loops
				let totalYears = i * yearsPerCanvas;
				
				if (totalYears > searchingFor) {
					var node = document.createElement('div');
					node.classList.add('year-indicator');
					let stringResult = generationCount + ' human generations';
					if (generationCount === 1) stringResult = stringResult.slice(0, -1);
					var textnode = document.createTextNode(stringResult);
					node.appendChild(textnode);
					element.appendChild(node);
					searchingFor += generationLength;
					generationCount++;
				}
				
				element.append(cloneCanvas(canvas));
				canvas.remove();
				totalCount += countPerCanvas;
				if (canvasCopies === 0) {
					totalCount = Math.floor(ratio);
				}
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
		},
		
		miniMap: function() {
			
			let self = this;
			var range = document.querySelector('.mini-map');
			var dragger = document.querySelector('.mini-map .dragger');
			var dragging = false, startY, currentY, draggerStartY;
			var moveableHeight = document.querySelector('.plastic-longevity .column-left').getBoundingClientRect().height - dragger.getBoundingClientRect().height;
			
			var totalProgress = 0;
			
			dragger.addEventListener('mousedown', function(event) {
				
				draggerStartY = previousDraggerTransform;
				if (isNaN(draggerStartY)) draggerStartY = 0;
				startY = event.clientY;
				dragging = true;
				updateDragger(event);
				return false;
			});
		
			document.addEventListener('mousemove', function(event) {
				
				currentY = event.clientY;
				if (dragging)  {
					updateDragger(event);
				}
			});
		
			document.addEventListener('mouseup', function(event) {
				dragging = false;
			});
		
			function updateDragger(event) {
				
				let deltaY = currentY - startY;
				draggerTransform = draggerStartY + deltaY;
				previousDraggerTransform = draggerTransform;
				
				if (draggerTransform > 0 && draggerTransform < moveableHeight) {
					dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
				}
				else if (draggerTransform < 0) {
					draggerTransform = 0;
					dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
				}
				else if (draggerTransform > moveableHeight) {
					draggerTransform = (moveableHeight - 1);
					dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
				}
				
				totalProgress = draggerTransform / (moveableHeight - 1);
				
				let scrollToY = canvasHolder.offsetHeight * totalProgress;
				unitVisContainer.scrollTo(0, scrollToY);
			}
			
			unitVisContainer.addEventListener('scroll', function(event) {
				
				let offset = 0;
				if (canvasHolder.offsetHeight > 10000) offset = 1000;
				let totalProgress = unitVisContainer.scrollTop / (unitVisContainer.scrollHeight - unitVisContainer.clientHeight);
				
				let number = countElement.querySelector('.number');
				let caption = countElement.querySelector('.caption');
				if (number) number.textContent = (Math.floor(totalCount * totalProgress)).toLocaleString() + 'x';
				if (caption) countElement.querySelector('.caption').style.opacity = '1'
				
				draggerTransform = moveableHeight * totalProgress;
				previousDraggerTransform = draggerTransform;
				dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
			});
		}
	}
}