module.exports = function () {
	
	var dataset;
	
	return {

		init: function () {
			this.myMethod();
		},

		myMethod: function() {
				

			var BelowText = d3.select('.monument-visualization').append("svg")
			.attr("class", "texts")
			.attr("width", 1000)
			.attr("height", 200);

				BelowText.append('text')
				.attr('x', 240)
				.attr('y', 100)
				.style('fill', 'black')
				.text('3200000mt')
				.style('font-size', '1.5em');

				BelowText.append('text')
				.attr('x', 750)
				.attr('y', 100)
				.style('fill', 'black')
				.text('eiffel')
				.style('font-size', '1.5em')

			/////////////////////////////////////////////
			
			var formatYear = d3.timeFormat("%Y");
			var formatDate = d3.timeFormat("%Y");
			var parseDate = d3.timeParse("%m/%y");

			var startDate = new Date("1949"),
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
				
			d3.csv("./assets/js/data/circless.csv", prepare).then(function(data) {
				dataset = data;
				drawPlot(dataset);
			});

			function prepare(d) {
				d.id = d.id;
				d.Year = parseDate(d.Year);
				return d;
			}

			function drawPlot(data) {
				
				var locations = plot.selectAll(".location").data(data);

				// if filtered dataset has more circles than already existing, transition new ones in
				locations.enter()
					.append("circle")
					.attr("class", "location")
					.attr("cx", d3.randomNormal(130,55)())
					.attr("cy", d3.randomNormal(200,55)())
					.style("fill", 'orange')
					.style("stroke", 'orange')
					.style("opacity", 0.4)
					.attr("r", 8)
					.transition()
					.duration(500)
					.attr("r", 12)
					.style("fill", "red")
						.transition()
						.attr("r", 8).style("fill", 'orange');

				locations.exit().remove();
			}

			function update(h) {
				// update position and text of label according to slider scale
				handle.attr("cx", scale(h));
				label.attr("x", scale(h))
					.text(formatDate(h));

				//filter data set and redraw plot
				var newData = dataset.filter(function(d) {
					return d.Year < h;
				});
				
				drawPlot(newData);
			}
		}
	}
}