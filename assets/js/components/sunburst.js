module.exports = function () {
	
	var svg, clicked;
	var upOneLevelIcon;
	var statsElement = document.querySelector('.sunburst-component .stats');
	
	return {

		init: function () {

			this.sunburst();
			this.addIcon();
		},

		sunburst: function () {
			'use strict';
			
			let self = this;
			const format = d3.format(",d");
			const width = document.querySelector('.sunburst .sunburst-container').offsetWidth;
			const radius = width / 6;
			document.querySelector('.sunburst').style.height = width + 'px';

			const arc = d3.arc()
						.startAngle(d => d.x0)
						.endAngle(d => d.x1)
						.padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
						.padRadius(radius * 1.5)
						.innerRadius(d => d.y0 * radius)
						.outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

			const partition = data => {
				const root = d3.hierarchy(data)
							.sum(d => d.size)
							.sort((a, b) => b.value - a.value);
				return d3.partition()
						.size([2 * Math.PI, root.height + 1])(root);
			};

			function arcVisible(d) {
				return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
			}

			function labelVisible(d) {
				return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
			}

			function labelTransform(d) {
				const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
				const y = (d.y0 + d.y1) / 2 * radius;
				return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
			}

			/**
			* Four working methods to load data:
			* (1) Inline data in json format (JS plain objects);
			* (2) From an https URL, which works only afer allowing cross origin requests
			*     on Firefox if the data URL is not the same as your app server;
			* (3) From a local file;
			* (4) Calling require()('@observablehq/flare') (observable-specific). In fact,
			*     The same as (2).
			*/

			//var data_url = "https://gist.githubusercontent.com/mbostock/1093025/raw/b40b9fc5b53b40836ead8aa4b4a17d948b491126/flare.json"; // network error!
			var dataURL = "https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json";

			//const {require} = new observablehq.Library;
			//require()('@observablehq/flare').then((data, error) => { // works!
			//d3.json(dataURL).then((data, error) => { // works behind proxy!
			d3.json("./assets/js/data/sunburst-countries.json").then((data, error) => { // works!
				//console.log(data);
				const root = partition(data);
				const color = d3.scaleOrdinal()
								.range(d3.quantize(d3.interpolateRainbow,
												data.children.length + 1));

				root.each(d => d.current = d);

				svg = d3.select('#partitionSVG')
						.style("height", width.toString() + "px")
						.style("font", "9px sans-serif");

				const g = svg.append("g")
							.attr("transform", `translate(${width / 2},${width / 2})`);

				const path = g.append("g")
							.selectAll("path")
							.data(root.descendants().slice(1))
							.join("path")
							.attr("fill", d => {
								while (d.depth > 1) { d = d.parent; }
								return color(d.data.name);
							})
							.attr("fill-opacity", d => 
								arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
							.attr("d", d => arc(d.current));

				path.filter(d => d.children)
					.style("cursor", "pointer")
					.on("click", clicked);

				path.append("title")
					.text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value) + ' metric tons'}`);

				const label = g.append("g")
							.attr("pointer-events", "none")
							.attr("text-anchor", "middle")
							.style("user-select", "none")
							.selectAll("text")
							.data(root.descendants().slice(1))
							.join("text")
							.attr("dy", "0.35em")
							.attr("fill-opacity", d => +labelVisible(d.current))
							.attr("transform", d => labelTransform(d.current))
							.text(d => d.data.name);

				const parent = g.append("circle")
								.datum(root)
								.attr("r", radius)
								.attr("fill", "none")
								.attr("pointer-events", "all")
								.on("click", clicked);

				function clicked(p) {
					parent.datum(p.parent || root);

					root.each(d => d.target = {
						x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
						x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
						y0: Math.max(0, d.y0 - p.depth),
						y1: Math.max(0, d.y1 - p.depth)
					});

					const t = g.transition().duration(500);

					// Transition the data on all arcs, even the ones that aren’t visible,
					// so that if this transition is interrupted, entering arcs will start
					// the next transition from the desired position.
					path.transition(t)
						.tween("data", d => {
							const i = d3.interpolate(d.current, d.target);
							return t => d.current = i(t);
						})
						.filter(function (d) {
							return +this.getAttribute("fill-opacity") || arcVisible(d.target);
						})
						.attr("fill-opacity", d =>
							arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
						.attrTween("d", d => () => arc(d.current));

					label.filter(function (d) {
						return this.getAttribute("fill-opacity") || labelVisible(d.target);
						}).transition(t)
						.attr("fill-opacity", d => +labelVisible(d.target))
						.attrTween("transform", d => () => labelTransform(d.current));
						
					if (p.parent === null) upOneLevelIcon.style.opacity = '0'; // show icon in lower depths
					else {
						upOneLevelIcon.style.opacity = '1';
					}
					
					if (p.children.length < 10) self.updateStats(p.children, p);
					else {
						self.hideStats();
					}
				}
			});
		},
		
		hideStats: function() {
			statsElement.style.opacity = '0';
		},
		
		updateStats: function(newRoot, parent) {
			
			statsElement.innerHTML = '';
			
			newRoot.forEach(function(child) {
						
				let regionName = child.data.name;
				let regionElement = document.createElement('div'), percentageElement = document.createElement('div'), regionNameElement = document.createElement('div');
				regionElement.classList.add('region');
				percentageElement.classList.add('percentage');
				regionNameElement.classList.add('region-name');
				
				let percentageValue = (child.value / parent.value) * 100;
				
				percentageElement.innerText = percentageValue.toFixed(0) + '%';
				if (percentageValue < 1) percentageElement.innerText = '‹1%';
				regionNameElement.innerText = regionName;
				regionElement.appendChild(percentageElement);
				regionElement.appendChild(regionNameElement);
				statsElement.appendChild(regionElement);
			});
			statsElement.style.opacity = '1';
		},
		
		addIcon: function() {
			
			d3.xml('./assets/svg/up-one-level.svg').then(function(data) {

				let icon = data.documentElement;
				upOneLevelIcon = icon;
				icon.classList.add('up-one-level');
				svg.node().append(icon);
				
				let sunburstWidth = svg.node().parentElement.offsetWidth;
				let iconHeight = sunburstWidth * .1;
				let iconWidth = icon.getBBox().width;
				
				svg.select('.up-one-level')
				.attr('height', iconHeight)
				.attr('x', (sunburstWidth/2 - iconWidth/2) - (iconWidth*.02))
				.attr('y', sunburstWidth/2 - iconHeight/2);
			});
		},
		
		initButtons: function() {
			
			let buttons = document.querySelectorAll('.sunburst .region-selector buttons');
			if (buttons) buttons.foreach(function(button) {
				
				button.addEventListener('click', function() {
					//clicked(root);
				});
			});
			
		}
	}
}