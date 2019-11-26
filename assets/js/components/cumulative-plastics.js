module.exports = function () {

	return {

		init: function () {
			this.myMethod();
		},

		myMethod: function() {
			
		var circle = d3.select('svgg').append("circle")
		.attr("cx", 300)
		   .attr("cy", 150) 
		   .style("fill", blue)
		.attr("r", 120);

		}
	}
}