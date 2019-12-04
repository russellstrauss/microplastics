module.exports = function () {
	
	var plasticProductionData;
	var dataset;
	var circleRadius = 8;
	var count = 0;


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

				playButton
				.on("click", function() {
				var button = d3.select(this);
				if (button.text() == "Pause") {
				  moving = false;
				  clearInterval(timer);
				// timer = 0;
				  button.text("Play");
				} else {
				  moving = true;
				  timer = setInterval(step, 260);
				  button.text("Pause");
				}

			  })
		
			});
			
			var monumentText = document.querySelector('.monument-visualization .label-container .monument-title');
			var totalWeightText = document.querySelector('.monument-visualization .label-container .weight');
			/////////////////////////////////////////////
			
			var formatYear = d3.timeFormat("%Y");
			var formatDate = d3.timeFormat("%Y");
			var parseDate = d3.timeParse("%m/%Y");

			var startDate = new Date("1950"),
				endDate = new Date("2020");

			var margin = {top:0, right:50, bottom:0, left:50},
				width = 400 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom,
				heightslider = 160,
				widthslider = 850;

				var moving = false;
				var currentValue = 0;
				var targetValue = widthslider;
				var timer = 0;
				var playButton = d3.select("#play-button");


			////////// slider //////////

			var svgSlider = d3.select("#slider")
				.append("svg")
				.attr("width", widthslider + margin.left + margin.right)
				.attr("height", heightslider);
				
			var scale = d3.scaleTime()
				.domain([startDate, endDate])
				.range([0, targetValue])
				.clamp(true);
				
			var yScale = d3.scaleLinear().domain([2019, 1950]).range([circleRadius*2, 390]);
			var xScale = d3.scaleLinear().domain([1950, 2019]).range([50, 1]);

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
						currentValue = d3.event.x;
						update(scale.invert(currentValue)); 
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
				.attr("r", 9)
				.style("fill", "orange");

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

			function step() {
				update(scale.invert(currentValue));
				currentValue = currentValue + (targetValue/120);
				if (currentValue > targetValue) {
				  moving = false;
				  currentValue = 0;
				  clearInterval(timer);
				//   timer = 0;
				  playButton.text("Play");

				}
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
					.attr("r", 14)
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
							
							let plasticAmount = parseInt(plasticProductionData[key].Cumulative.toLocaleString());
							
							totalWeightText.textContent = parseInt(plasticProductionData[key].Cumulative).toLocaleString() +'(t)';
							
							let monumentImages = document.querySelectorAll('.monument-visualization .image-container img');
							monumentImages.forEach(function(image) {
								image.style.opacity = "0";
							});
						

							if (plasticAmount > 2000001 && plasticAmount < 30000000) {
								var sushiImage = document.querySelector('img.sushi');
								sushiImage.style.opacity = '1';
								monumentText.textContent = 'Statue of Liberty(x10000)';

							}
							else if (plasticAmount > 30000001 && plasticAmount < 60000000) {
								var eiffelImage = document.querySelector('img.eiffel');
								eiffelImage.style.opacity = '1';

								monumentText.textContent = 'Eiffel Tower(x4054)';
							}
							else if (plasticAmount > 60000001 && plasticAmount < 300000000) {
								var pyramidImage = document.querySelector('img.pyramid');
								pyramidImage.style.opacity = '1';

								monumentText.textContent = 'Pyramid';
							}
							else if (plasticAmount > 300000001 && plasticAmount < 500000000) {
								var gtImage = document.querySelector('img.gt');
								gtImage.style.opacity = '1';

								monumentText.textContent = 'GT Buildings';
							}
							else if (plasticAmount > 500000001 && plasticAmount < 700000000) {
								var greatwallImage = document.querySelector('img.greatwall');
								greatwallImage.style.opacity = '1';

								monumentText.textContent = 'Great Wall';
							}
							else if (plasticAmount > 700000001 && plasticAmount < 900000000) {
								var populationImage = document.querySelector('img.population');
								populationImage.style.opacity = '1';

								monumentText.textContent = 'Weight of World Popluation';
							}
							else if (plasticAmount > 900000001 && plasticAmount < 1100000000) {
								var skyscrapperImage = document.querySelector('img.skyscrapper');
								skyscrapperImage.style.opacity = '1';

								monumentText.textContent = 'Weight of Skyscrappers \n in the world';
							}
							else if (plasticAmount > 1100000001 && plasticAmount < 3000000000) {
								var roadImage = document.querySelector('img.road');
								roadImage.style.opacity = '1';

								monumentText.textContent = 'Weight of US Road System';
							}
							else if (plasticAmount > 3000000001 && plasticAmount < 5100000000) {
								var icebergImage = document.querySelector('img.iceberg');
								icebergImage.style.opacity = '1';

								monumentText.textContent = 'Weight of Icebergs in Antartica';
							}
							else if (plasticAmount > 5100000001 && plasticAmount < 7500000000) {
								var carImage = document.querySelector('img.car');
								carImage.style.opacity = '1';

								monumentText.textContent = 'Weight of total Car';
							}
							else if (plasticAmount > 7500000001 && plasticAmount < 10000000000) {
								var cometImage = document.querySelector('img.comet');
								cometImage.style.opacity = '1';

								monumentText.textContent = 'Chicxulub Asteroid';
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