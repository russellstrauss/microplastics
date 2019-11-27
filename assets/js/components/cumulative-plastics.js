module.exports = function () {

	return {

		init: function () {
			this.myMethod();
		},

		myMethod: function() {
			
		var circle = d3.select('.monument-visualization').append("svg")
		.attr("width", 600)
		.attr("height", 400);

		var circles = circle.append("circle")
			.attr("cx", 300)
		   .attr("cy", 150) 
		   .style("fill", "blue")
			.attr("r", 120);

		}
	}
}