module.exports = function() {
	
	var pie = document.querySelector('.eat-pie');
	var data;
	var width;
	if (pie) width = parseInt(pie.offsetWidth * .8);
	var height = width;
	
	var currentYearIndex = 30;
	
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

			var radius = Math.min(width, height) / 2;

			var svg = d3.select(".eat-pie")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
			
			// set the color scale
			var color = d3.scaleOrdinal()
			.domain(data)
			.range(["black", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

			// Compute the position of each group on the pie:
			var pie = d3.pie().value(function(d) {
				return d.values[currentYearIndex].percentage;
			});
			var data_ready = pie(data);


			// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
			svg.selectAll('whatever')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', d3.arc().innerRadius(0).outerRadius(radius))
			.attr('fill', function(d){ return(color(d.data.key)) })
			.style("opacity", 0.7);
			
			svg.append('circle').attr('class', 'mask').attr('cx', 0).attr('cy', 0).attr('r', width / 3).attr('fill', 'white');;
			

		},
		
		decrementYear: function() {
			
		},
		
		incrementYear: function() {
			
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