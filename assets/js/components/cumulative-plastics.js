module.exports = function () {

	return {

		init: function () {
			this.myMethod();
		},

		myMethod: function() {
			
		var circle = d3.select('.monument-visualization').append("svg")
		.attr("width", 500)
		.attr("height", 300);

		var circles = circle.append("circle")
		.attr("cx", 300)
		   .attr("cy", 180) 
		   .style("fill", "orange")
			.attr("r", 100);

		var BelowText = d3.select('.monument-visualization').append("svg")
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
			.text('effel')
			.style('font-size', '1.5em')

/////////////////////////////////////////////
var dataset;
  
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");
var parseDate = d3.timeParse("%m/%d/%y");

var startDate = new Date("2004-11-01"),
	endDate = new Date("2017-04-01");

var margin = {top:0, right:50, bottom:0, left:50},
	width = 960 - margin.left - margin.right,
	height = 200 - margin.top - margin.bottom;

////////// slider //////////

var svgSlider = d3.select("#slider")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height);
	
var x = d3.scaleTime()
	.domain([startDate, endDate])
	.range([0, width])
	.clamp(true);

var slider = svgSlider.append("g")
	.attr("class", "slider")
	.attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

slider.append("line")
	.attr("class", "track")
	.attr("x1", x.range()[0])
	.attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	.attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	.attr("class", "track-overlay")
	.call(d3.drag()
		.on("start.interrupt", function() { slider.interrupt(); })
		.on("start drag", function() { update(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
	.attr("class", "ticks")
	.attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
	.data(x.ticks(10))
	.enter()
	.append("text")
	.attr("x", x)
	.attr("y", 10)
	.attr("text-anchor", "middle")
	.text(function(d) { return formatDateIntoYear(d); });

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
	

d3.csv("./assets/js/data/circles.csv", prepare, function(data) {
  dataset = data;
  drawPlot(dataset);
})

function prepare(d) {
  d.id = d.id;
  d.date = parseDate(d.date);
  return d;
}

function drawPlot(data) {
  var locations = plot.selectAll(".location")
	.data(data);

  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
	.append("circle")
	.attr("class", "location")
	.attr("cx", function(d) { return x(d.date); })
	.attr("cy", height/2)
	.style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
	.style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
	.style("opacity", 0.5)
	.attr("r", 8)
	  .transition()
	  .duration(400)
	  .attr("r", 25)
		.transition()
		.attr("r", 8);

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
	.remove();
}

function update(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  label
	.attr("x", x(h))
	.text(formatDate(h));

  // filter data set and redraw plot
  var newData = dataset.filter(function(d) {
	return d.date < h;
  })
  drawPlot(newData);
}


		}
	}
}