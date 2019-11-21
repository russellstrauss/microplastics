module.exports = function() {
	
	var pie = document.querySelector('.eat-pie');
	var data;
	var width;
	if (pie) width = parseInt(pie.offsetWidth);
	var height = width;
	var radius = Math.min(width, height) / 2;
	var color;
	var svg;
	var slices, polyline;
	
	var innerArc = d3.arc().innerRadius(radius * .8).outerRadius(radius * 1.25);
	var outerArc = d3.arc().innerRadius(width / 3).outerRadius(radius);
	var key = function(d){ return d.data.category; };
	var currentYearIndex = 0;
	
	return {
		
		settings: {
			
		},
		
		init: function() {

			let self = this;
			
			d3.csv('./assets/js/data/global-plastic-fate.csv', function(fate) {
				data = d3.nest().key(function(d) {
					return d.category;
				})
				.entries(fate);
				
				self.eatPie();
				self.bindEvents();
			});
		},
		
		eatPie: function() {
			
			let self = this;

			svg = d3.select(".eat-pie")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
			
			svg.append('circle').attr('class', 'mask').attr('cx', 0).attr('cy', 0).attr('r', width / 3).attr('fill', 'white');
			
			slices = svg.append("g")
			.attr("class", "slices");
			svg.append("g")
			.attr("class", "labels");
			svg.append("g")
			.attr("class", "lines");
			

			// Compute the position of each group on the pie:
			pie = d3.pie().value(function(d) {
				if (parseInt(d.values[currentYearIndex].percentage) === 0) return 1;
				return d.values[currentYearIndex].percentage;
			});
			
			color = d3.scaleOrdinal()
			.domain(data)
			.range(["black", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

			// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
			slices.selectAll('path')
			.data(pie(data))
			.enter()
			.append('path')
			.style("opacity", 0.7)
			.attr('d', outerArc)
			.attr('fill', function(d){ return(color(d.data.key)) });
			
			self.eatMorePie();
		},
		
		eatMorePie: function() {
			
			pie.value(function(d) {
				
				if (parseInt(d.values[currentYearIndex].percentage) === 0) return 1;
				
				return d.values[currentYearIndex].percentage;
			});
			
			slices = svg.selectAll('path').data(pie(data))
			.transition()
			.duration(250)
			.attr('d', outerArc)
			.attr('fill', function(d){ return(color(d.data.key)) });
			
			
			
			/* ------- TEXT LABELS -------*/

			var text = svg.select(".labels").selectAll("text")
			.data(pie(data), key);

			// text.enter()
			// .append("text")
			// .attr("dy", ".35em")
			// .text(function(d, key) {
			// 	console.log(d.data.key)
			// 	return d.data.key;
			// });

			function midAngle(d){
				return d.startAngle + (d.endAngle - d.startAngle)/2;
			}
			
			var arc = d3.arc()
			.outerRadius(radius * 0.8)
			.innerRadius(radius * 0.4);

			text.transition().duration(1000)
			.attrTween("transform", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			});

			text.exit().remove();

			/* ------- SLICE TO TEXT POLYLINES -------*/

			var polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key);
			polyline.enter().append("polyline");
				
			var arcCentroid = svg.select('.labels').selectAll('circle').data(pie(data), key);
			var arcEnter = arcCentroid.enter().append('circle');
			//console.log(arcEnter);
			
			arcCentroid
			//.transition().duration(1000)
			.attr('cx', function(d) {
				
				
				
				let centroid = outerArc.centroid(d);
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				

				let inner = function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
				};
				
				//console.log(inner(0)[i][0]);
				//return parseInt(inner(0)[0]);
				//console.log(outerArc.centroid(d));
				
				return outerArc.centroid(d)[0];
			}).attr('cy', function(d) {
				let centroid = outerArc.centroid(d);
				
				
				let inner = function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
				};
				
				//return parseInt(inner(0)[i][0]);
				
				return outerArc.centroid(d)[1];
			})
			.attr('class', 'centroid').attr('r', 10).attr('fill', 'black');
			
			polyline.transition().duration(1000)
			.attrTween("points", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
				};			
			});

			//arcCentroid.exit().remove()
			polyline.exit().remove();
		},
		
		decrementYear: function() {
			currentYearIndex--;
			this.eatMorePie();
		},
		
		incrementYear: function() {
			currentYearIndex++;
			this.eatMorePie();
		},
		
		bindEvents: function() {
			
			let self = this;
			
			let inputSteppers = document.querySelectorAll('.input-stepper');
			inputSteppers.forEach(function(inputStepper) {
				
				inputStepper.style.width = width.toString() + 'px';
				
				let input = inputStepper.querySelector('input');
					
				let increase = inputStepper.querySelector('.increase');
				if (increase) increase.addEventListener('click', function() {
					let max = parseInt(input.getAttribute('max'));
					if (input.value < max) {
						input.value = parseInt(input.value) + 1;
						self.incrementYear();
					}
				});
				
				let decrease = inputStepper.querySelector('.decrease');
				if (decrease) decrease.addEventListener('click', function() {
					let min = parseInt(input.getAttribute('min'));
					if (input.value > min) {
						input.value = parseInt(input.value) - 1;
						self.decrementYear();
					}
				});
			});
		}
	}
}