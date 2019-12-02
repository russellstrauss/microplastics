module.exports = function () {
	
	var plasticProductionData;
	var dataset;
	var circleRadius = 8;
	var count = 0;
	var plasticProductionTextField;
	var monumentImage = document.querySelector('.monument');
	
	return {

		init: function () {
			this.myMethod();
		},

		myMethod: function() {
			
			d3.csv("./assets/js/data/cumulative.csv").then(function(data) {
				plasticProductionData = data;
			});
			d3.csv("./assets/js/data/circless.csv", prepare).then(function(data) {
				dataset = data;
			});
			
			var BelowText = d3.select('.monument-visualization').append("svg")
			.attr("class", "texts")
			.attr('id', 'plasticProduction')
			.attr("width", 1000)
			.attr("height", 200);

				plasticProductionTextField = BelowText.append('text')
				.attr('x', 180)
				.attr('y', 100)
				.style('fill', 'black')
				.style('font-size', '1.5em')
				.text('2000000mt');

				BelowText.append('text')
				.attr('x', 510)
				.attr('y', 105)
				.style('fill', 'black')
				.style('font-size', '2em')
				.text("=");

				var monumentText = BelowText.append('text')
				.attr('x', 745)
				.attr('y', 100)
				.style('fill', 'black')
				.text('Eiffel Tower')
				.style('font-size', '1.5em')

			/////////////////////////////////////////////
			
			var formatYear = d3.timeFormat("%Y");
			var formatDate = d3.timeFormat("%Y");
			var parseDate = d3.timeParse("%m/%Y");

			var startDate = new Date("1950"),
				endDate = new Date("2020");

			var margin = {top:0, right:50, bottom:0, left:50},
				width = 400 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom,
				heightslider = 200,
				widthslider = 850;
			////////// slider //////////

			var svgSlider = d3.select("#slider")
				.append("svg")
				.attr("width", widthslider + margin.left + margin.right)
				.attr("height", heightslider);
				
			var scale = d3.scaleTime()
				.domain([startDate, endDate])
				.range([0, widthslider])
				.clamp(true);
				
			var yScale = d3.scaleLinear().domain([2019, 1950]).range([circleRadius*2, 350]);
			var xScale = d3.scaleLinear().domain([1950, 2019]).range([60, 10]);

			var slider = svgSlider.append("g")
				.attr("class", "slider")
				.attr("transform", "translate(" + margin.left + "," + heightslider / 2 + ")");

			slider.append("line")
				.attr("class", "track")
				.attr("align", "center")
				.attr("x1", scale.range()[0])
				.attr("x2", scale.range()[1])
			.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
				.attr("class", "track-inset")
			.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
				.attr("class", "track-overlay")
				.call(d3.drag()
					.on("start.interrupt", function() { slider.interrupt(); })
					.on("start drag", function() {
						update(scale.invert(d3.event.x));
					}));
					

			function dragged(d) {
				circle.raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
			}

			slider.insert("g", ".track-overlay")
				.attr("class", "ticks")
				.attr("transform", "translate(0," + 18 + ")")
			.selectAll("text")
				.data(scale.ticks(10))
				.enter()
				.append("text")
				.attr("x", scale)
				.attr("y", 10)
				.attr("text-anchor", "middle")
				.text(function(d) { return formatYear(d); });

			var handle = slider.insert("circle", ".track-overlay")
				.attr("class", "handle")
				.attr("r", 9);

			var label = slider.append("text")  
				.attr("class", "label")
				.attr("text-anchor", "middle")
				.text(formatDate(startDate))
				.attr("transform", "translate(0," + (-25) + ")")

			////////// plot //////////

			var svgPlot = d3.select("#vis")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height);

			var plot = svgPlot.append("g")
				.attr("class", "plot")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
			
			function prepare(d) {
				d.id = d.id;
				d.Date = parseDate(d.Year);
				d.Year = parseDate(d.Year).getYear() + 1900
				return d;
			}

			function drawPlot(data) {
				
				var locations = plot.selectAll(".location").data(data);

				// if filtered dataset has more circles than already existing, transition new ones in
				
				locations.enter()
					.append("circle")
					.attr("class", "location")
					.style("opacity", 0)
					.attr("cx", function(d) {
						return d3.randomNormal(140, xScale(d.Year))();
					})
					.attr("cy", 10)
					.style("fill", 'orange')
					.style("stroke", 'orange')
					.attr("r", circleRadius)
					.transition()
					.duration(500)
					.attr("r", 10)
					.style("fill", "red")
						.transition()
						.attr("r", 8).style("fill", 'orange')
						.style('opacity', .4)
						.transition()
						.attr("cy", function(d) {
							return yScale(d.Year)
						});
					


				locations.exit().remove();
			}

			function update(h) {
				// update position and text of label according to slider scale
				handle.attr("cx", scale(h));
				label.attr("x", scale(h))
					.text(formatDate(h));
					
					
					var year = 1950;
					var index = Object.keys(plasticProductionData).indexOf(year.toString());
					var production = 0;
					
					Object.keys(plasticProductionData).forEach(function eachKey(key) {
						year = formatYear(h);
						if (parseInt(plasticProductionData[key].Year) === parseInt(year)) {
							
							let plasticAmount = parseInt(plasticProductionData[key].Cumulative);
							
							plasticProductionTextField.text(plasticProductionData[key].Cumulative + 'mt');
							
							console.log(plasticAmount);
							if (plasticAmount < 2000001) {
								// set image 1
								console.log(monumentImage);
								monumentImage.src = './assets/img/sushi.jpg';
								monumentText.text('Sushi')
							}
							else if (plasticAmount > 2000001 && plasticAmount < 5000000) {
								monumentImage.src = './assets/img/effel.png';
								monumentText.text('Eiffel');
							}
							
							
						};
					});
					
					
					
					
				//filter data set and redraw plot
				var newData = dataset.filter(function(d) {
					return d.Date < h;
				});
				
				drawPlot(newData);
			}
		}
	}
}