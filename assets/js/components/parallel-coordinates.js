module.exports = function () {
	
	var clearButton;
	
	return {
		dimensions: null,
		settings: {

		},

		init: function () {
			this.parallelCoordinates();
		},

		parallelCoordinates: function () {
			// GLOBALS
			var DATA_URL = './assets/js/data/aggregated.csv';
			var DATA = {};

			// END GLOBALS

			// LOAD DATA

			function toTitleCase(str) {
				return str.replace(/\w\S*/g, function(txt){
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				});
			}
			
			var parentElement = document.querySelector('.paracoords');
			
			const svgWidth = parentElement.offsetWidth * .60, // setting width to 60% of parent container for responsiveness. Adjust if necessary.
				svgHeight = window.innerHeight * .60,
				margin = { top: 30, right: 100, bottom: 30, left: 100 },
				width = svgWidth - margin.left - margin.right,
				height = svgHeight - margin.top - margin.bottom;
			var x,
				y = {},
				dimensions,
				dragging = {},
				sliders;

			var foreground_enter,
				foreground_group,
				background_enter,
				background_group,
				country_container_enter,
				country_container_group;

			var selected = [];
			var country_container_element;

			var div_selector = 'div.paracoords';

			var svg = d3.select(div_selector).append("svg")
				.attr('id', 'paracoords-svg')
				.attr("width", svgWidth)
				.attr("height", svgHeight)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var foreground = svg.append('g').attr('class', 'foreground');
			var background = background_group = svg.append('g').attr('class', 'background');


			// var country_selector = d3.select('body').append('input')
			//     .attr('type', 'text')
			//     .attr('class', 'country-selector')
			//     .attr('placeholder', 'Country')
			//     .attr('value', '');
			var selectors = d3.select(div_selector).append('div').attr('id', 'selectors');
			selectors.append('h2').text('Select Countries')
			var country_container = selectors.append('select')
				.attr('class', 'country-container')
				.attr('multiple', 'true')
				.attr('size', 10);
				
			var clearButton = selectors.append('div').attr('class', 'button-container')
				.append('button')
				.attr('class', 'clear-all-countries')
				.text('Clear All');
				

			var function_keys = {
				fish_consumption: 0.5,
				coastal_population: 0.5,
				gdp: 0.5
			}

			var tooltip_div = d3.select(div_selector)
				.append('div')
				.attr('class', 'tooltip')
				.style('opacity', 0);

			d3.csv(DATA_URL).then(function(data) {
				
				var scales = {
					total_population: d3.scaleLinear().domain([0, d3.max(data, d => {return d.total_population})]).range([0, 1]),
					coastal_population: d3.scaleLinear().domain([0, d3.max(data, d => {return d.coastal_population})]).range([0, 1]),
					plastic_waste_per_capita: d3.scaleLinear().domain([0, d3.max(data, d => {return d.plastic_waste_per_capita})]).range([0, 1]),
					plastic_waste_total: d3.scaleLinear().domain([0, d3.max(data, d => {return d.plastic_waste_total})]).range([0, 1]),
					fish_consumption: d3.scaleLinear().domain([0, d3.max(data, d => {return d.fish_consumption})]).range([0, 1]),
					gdp: d3.scaleLinear().domain([0, d3.max(data, d=> {return d.gdp})]).range([0, 1])
				}

				// var data = []

				data.forEach (function(d, i) {
						d.code =  d.code;
						d.country = d.country;
						d.total_population = scales.total_population(+d.total_population);
						d.coastal_population = scales.coastal_population(+d.coastal_population);
						d.plastic_waste_per_capita = scales.plastic_waste_per_capita(+d.plastic_waste_per_capita);
						d.plastic_waste_total = scales.plastic_waste_total(+d.plastic_waste_total);
						d.fish_consumption = scales.fish_consumption(+d.fish_consumption);
						d.gdp = scales.gdp(+d.gdp);
				});

				data = calcImpactMetric(data);
				data = calcRankings(data);

				data.sort(function(a, b) {
					return d3.ascending(a.country, b.country)
				});

				drawCountries('', data);

				clearButton.on('click', function() {
					
					document.querySelector('.country-container').querySelectorAll('option').forEach(function(option) {
						option.selected = false;
					});
					
					var storedScrollLocation = country_container_element.scrollTop;
					
					selected = [];
					draw(data);
					
					setTimeout(function(){country_container_element.scrollTop = storedScrollLocation;}, 0);
				});

				dimensions = d3.keys(data[0]).filter(function(key) {
					if (key == 'pollute_rank') {
						y[key] = d3.scaleLinear()
							.domain(d3.extent(data, function(d) {
								return +d[key];
							}).reverse())
							.range([height, 0]);
						return key;
					} else if (key == 'impact_rank') {
						y[key] = d3.scaleLinear()
							.domain(d3.extent(data, d => {
								return +d[key];
							}).reverse())
							.range([height, 0])
						return key;
					}
					// } else if (key == 'inadequately_managed_plastic_rank') {
					//     y[key] = d3.scaleLinear()
					//         .domain(d3.extent(data, function(d) {
					//             return +d[key];
					//         }).reverse())
					//         .range([0, height]);
					//     return key;
					// }
				});

				x = d3.scalePoint()
					.domain(dimensions)
					.range([0, width]);

				draw(data);
				
				selectors.append('h2').text('Adjust Ranking')
				var table = selectors.append('table').attr('class', 'slider-table');
				Object.keys(function_keys).forEach(function(d) {
					var tr = table.append('tr')
					var span_td = tr.append('td');
					span_td.append('span')
						.text(() => {
							if (d == 'coastal_population')
								return 'Coastal Population: ';
							else if (d == 'gdp')
								return 'Gross Domestic Product: ';
							else if (d == 'fish_consumption')
								return 'Fish Consumption: '
							else
								return 'null';
						});
					var slider_td = tr.append('td');
					var slider = slider_td
						.append('input')
						.attr('type', 'range')
						.attr('min', '0')
						.attr('max', '100')
						.property('value', '50')
					slider
						.on('input', () => {
						function_keys[d] = slider.property('value') / 100;

						data = calcImpactMetric(data);
						data = calcRankings(data);
						draw(data);
					});
				});
				
				selectors.append('div').attr('class', 'legend').append('div').attr('class', 'colorscale-gradient');

				var g = svg.selectAll(".dimension")
					.data(dimensions)
					.enter().append("g")
					.attr("class", "dimension")
					.attr("transform", function (d) { return "translate(" + x(d) + ")"; })
					.call(d3.drag()
						.on("start", function (d) {
							dragging[d] = x(d);
							background_group.attr("visibility", "hidden");
						})
						.on("drag", function (d) {
							dragging[d] = Math.min(width, Math.max(0, d3.event.x));
							foreground_group.attr("d", line);
							dimensions.sort(function (a, b) { return position(a) - position(b); });
							x.domain(dimensions);
							g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
						})
						.on("end", function (d) {
							delete dragging[d];
							transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
							transition(foreground_group).attr("d", line);

							background_group
								.attr("d", line)
								.transition()
								.delay(500)
								.duration(0)
								.attr("visibility", null);
							})
					);

				g.append("g")
					.attr("class", "axis")
					.each(function (d) { 
						if (d == 'pollute_rank')
							d3.select(this).call(d3.axisLeft().scale(y[d])); 
						else if (d == 'impact_rank')
							d3.select(this).call(d3.axisRight().scale(y[d])); 
					})
					.append("text")
					.style("text-anchor", "middle")
					.attr("fill", "black")
					.attr("font-size", "12")
					.attr("y", -9)
					.text(function (d) { 
						if (d == 'pollute_rank')
							return "Contribution (rank)";
						else if (d == 'inadequately_managed_plastic_rank')
							return "Inadequately Managed Plastic (Rank)"
						else
							return "Impact (rank)";
					});

				g.append("g")
					.attr("class", "brush")
					.each(function (d) {
						d3.select(this).call(y[d].brush = d3.brushY()
							.extent([[-10, 0], [10, height]])
							.on("start", brushstart)
							.on("brush", brush)
							.on("end", brush))
							.on('click', () => {
								d3.select(this).call(y[d].brush.move, null);
							});
						})
					.selectAll("rect")
					.attr("x", -8)
					.attr("width", 16);
				
			});

			function drawCountries(filt, data) {
				country_container_group = country_container.selectAll('option')
					.data(data, d => d.code);
				country_container_group.exit().remove();
				country_container_enter = country_container_group.enter()
					.append('option')
					.attr('style', d => {return 'background-image: url(./assets/img/countries/' 
						+ d.country + '.svg)'});
				country_container_group = country_container_group.merge(country_container_enter)
					.attr('class', 'country')
					.attr('id', d => {return d.code })
					.html(d => {return '<img src="./assets/img/countries/' 
						+ d.country 
						+ '.svg"></img><span>'
						+ toTitleCase(d.country.replace(new RegExp('-', 'gi'), ' ')) + '</span>'})
					.on('mousedown', d => {
						d3.event.preventDefault();
						country_container_element = document.querySelector('.country-container');
						var storedScrollLocation = country_container_element.scrollTop;
						if (selected.indexOf(d.code) >= 0) {
							for(var i = 0; i < selected.length; i++) {
								if (selected[i] == d.code)
									selected.splice(i, 1);
							}
							document.getElementById(d.code).selected = false;
						} else {
							selected.push(d.code);
							document.getElementById(d.code).selected = true;
						}
						setTimeout(function(){country_container_element.scrollTop = storedScrollLocation;}, 0);
						draw(data);
					});
			}

			function draw(data) {
				// draw the background, make sure it merges so that when the
				// data gets updated nothing fucky happens

				// y['impact_rank'] = d3.scaleLinear()
				//     .domain(d3.extent(data, function(d) {
				//         return impact(d);
				//     }).reverse())
				//     .range([height, 0]);

				// draw the forerground, do the same thing. Note that tooltips
				// are also included here. 

				var color = d3.scaleLinear()
					.domain(d3.extent(data, function(d) {
						return d.inadequately_managed_plastic;
					}))
					.range([0, 1]);

				var filtered_data = data.filter(d => {
					return selected.indexOf(d.code) >= 0
				});
				foreground_group = foreground.selectAll('path')
					.data(filtered_data, d => d.code);
				foreground_group.exit().remove();
				foreground_enter = foreground_group.enter().append('path')
					.on('mouseover', tooltip)
					.on('mouseout', () => {
						tooltip_div.style('opacity', 0);
					})
					.attr('stroke', function(d) {
						return d3.interpolateRgb('red', 'rgb(0, 176, 255)')(color(d.inadequately_managed_plastic));
					});

				foreground_group = foreground_group.merge(foreground_enter)
					.attr('d', line)
					.style('stroke-width', 5)
					.style('opacity', d => {
						return selected.indexOf(d.code) >= 0 ? 1 : 0;
					});

				background_group = background.selectAll('path')
					.data(filtered_data, d=> d.code);
				background_group.exit().remove();
				background_enter = background_group.enter()
					.append('path');    
				background_group = background_group.merge(background_enter)
					.attr('d', line)
					.style('display', d => {
						return selected.indexOf(d.code) >= 0 ? 1 : 0;
					});
			}

			function tooltip(d) {
				// tooltip_div is declared as a global variable
				// at the top of the file. For convenience,
				/*
				tooltip_div = d3.select('body')
					.append('div')
					.attr('class', 'tooltip')
					.style('opacity', 0);
				*/
				tooltip_div.style('opacity', 0.9);
				tooltip_div.html('<b class="title">' + toTitleCase(d.country.replace(new RegExp('-', 'gi'), ' '))  + '</b><br/>Pollution Rank: ' + d.pollute_rank + '<br/>Impact Rank: ' + d.impact_rank)
					.style('left', d3.event.pageX + 10 +'px')
					.style('top', d3.event.pageY - 28 + 'px');
			}

			function calcRankings(data) {
				var rankings = [];

				data.sort(function(a, b) {
					return d3.descending(a.plastic_waste_total, b.plastic_waste_total);
				}).forEach(function(d, i) {
					d.pollute_rank = i + 1;
				});

				data.sort(function(a, b) {
					return d3.descending(a.impact, b.impact);
				}).forEach(function(d, i) {
					d.impact_rank = i + 1;
				});

				data.sort(function(a, b) {
					return d3.descending(a.inadequately_managed_plastic, b.inadequately_managed_plastic);
				}).forEach(function(d, i) {
					d.inadequately_managed_plastic_rank = i + 1;
				});

				return data;
			}

			function calcImpactMetric(data) {
				data.forEach(function(d) {
					d.impact =  (function_keys.coastal_population * (d.coastal_population/d.total_population)) + (function_keys.fish_consumption * d.fish_consumption) - (function_keys.gdp * d.gdp);
				});

				return data;
			}

			function line(d) {
				return d3.line()(dimensions.map(function(key) {
					if (key == 'impact_rank') {
						return [x(key), y[key](d[key])];
					} else {
						return [x(key), y[key](d[key])];
					}
				}));
			}

			function brushstart() {
				d3.event.sourceEvent.stopPropagation();
			}

			// Handles a brush event, toggling the display of foreground lines.
			function brush() {
				// Get a set of dimensions with active brushes and their current extent.
				var actives = [];
				svg.selectAll(".brush")
					.filter(function (d) {
						return d3.brushSelection(this);
					})
					.each(function (key) {
						actives.push({
							dimension: key,
							extent: d3.brushSelection(this)
						});
					});
				// Change line visibility based on brush extent.
				if (actives.length === 0) {
					foreground_group.style("display", null);
				} else {
					foreground_group.style("display", function (d) {
						return actives.every(function (brushObj) {
							return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension]) && y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1];
						}) ? null : "none";
					});
				}
			}

			function position(d) {
				var v = dragging[d];
				return v == null ? x(d) : v;
			}

			function transition(g) {
				return g.transition().duration(500);
			}

			function impact(d) {
				return ((-1) * (function_keys.coastal_population * (d.coastal_population/d.total_population))) - (function_keys.fish_consumption * d.fish_consumption) + (function_keys.gdp * d.gdp);
			}
		}
	}
}