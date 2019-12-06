require('leaflet-arc');

module.exports = function() {
	
	var selectColor = '#E66200';
	var defaultColor = '#E6965B';
	
	var exportsStatsLabel = 'total global plastic exports', importsStatsLabel = 'total global plastic imports';
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	var mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var graph, countriesLayer, barGraphTitle, worldTotal;
	var mapData, exportsData, importsData, mismanagedData, geojson, toolTip, barData, barWidth, barPadding, barGraphInnerHeight;
	
	var china = {
		location: new L.LatLng(23.638, 120.998),
		zoom: 3
	}
	
	var center = {
		location: new L.LatLng(30, 20),
		zoom: 2.5
	}
	
	var setLocation = center;
	
	var map = L.map('map', { 
		zoomControl: false,
		zoomSnap: 0.01
	}).setView(setLocation.location, setLocation.zoom);
	var svg = d3.select('#map').select('svg');
	var pointsGroup = svg.select('g').attr('class', 'points').append('g');
	
	let northwestCorner = L.latLng(120, -171);
	let southeastCorner = L.latLng(-40, 175);
	
	let bounds = L.latLngBounds(northwestCorner, southeastCorner);
	map.setZoom(map.getBoundsZoom(bounds));
	
	var svgLayer = L.svg();
	svgLayer.addTo(map);
	
	return {
		
		init: function() {

			let self = this;
			
			self.map();
			self.exports();
			self.bindUI();
			//self.toolTip();
		},
		
		toolTip: function() {
			
			toolTip = d3.tip()
			.attr("class", "d3-tip")
			.offset([-12, 0])
			.html(function(d) {
				return '<div class="tooltip"><h5>'+d['name']+"</h5></div>"
			});
			svg.call(toolTip);
		},
		
		setScrollPoints: function() {
			
			let self = this;
			let veil = document.querySelector('.veil');
			
			var waypoint = new Waypoint({
				element: document.getElementById('showAsia'),
				handler: function(direction) {
					
					if (direction === 'down') {
						
					}
					else {
						
					}
				},
				offset: 0
			});
		},
		 
		exports: function() {
			
			let self = this;
			
			d3.csv('./assets/js/data/imports.csv', prepareImports).then(function(data) {
				importsData = data;
			});
			
			function prepareImports(d) {
				let row = [];
				row.amount = d['2017'];
				
				if (d['Partner Name'] === 'World') {
					worldTotal = row.amount;
				}
				
				if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === 'World') {
					row.region = d['Partner Name'];
				}
				else {
					row.country = d['Partner Name'];
				}
				
				if (row.amount !== '' && row.country) return row;
			}
			
			d3.csv('./assets/js/data/mismanaged.csv', prepareMismanaged).then(function(data) {
				mismanagedData = data;
			});
			
			function prepareMismanaged(d) {
				let row = [];
					row.amount = d['Share of plastic inadequately managed (%)'];
					row.country = d['Entity'];
					
					if (row.amount !== '' && row.country) return row;
			}
			
			d3.json('./assets/js/data/ne_10m_admin_0_countries.json').then(function(json) {
				
				geojson = json;
				
				d3.csv('./assets/js/data/exports.csv', prepareExports).then(function(data) {
					exportsData = data;
					mapData = exportsData;
					//console.log(exportsData);
					
					self.showCountries();
					self.addBarGraph();
				});
				
				function prepareExports(d) {
					let row = [];
					row.amount = d['2017'];
					
					if (d['Partner Name'] === 'World') {
						worldTotal = row.amount;
					}
					
					if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === 'World') {
						row.region = d['Partner Name'];
					}
					else {
						row.country = d['Partner Name'];
					}
					
					if (row.amount !== '' && row.country) return row;
				}
			});
		},
		
		map: function() {
			
			let self = this;
			var mapElement = d3.select('.fullscreen-map');
			var mapWidth = parseInt(mapElement.offsetWidth);
			var mapHeight = parseInt(mapElement.offsetHeight);
			
			var vertices = d3.map();
			var activeMapType = 'nodes_links';
			
			L.tileLayer(mapWithoutLabels, {
				id: 'mapbox.light',
				accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
				edgeBufferTiles: 2,
				reuseTiles: true,
				format: 'jpg70',
				noWrap: true
			}).addTo(map);
			
			map.dragging.disable();
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
		},
		
		showLabels: function() {
			L.tileLayer(mapWithLabels, {
				id: 'mapbox.light',
				accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
				edgeBufferTiles: 2
			}).addTo(map);
		},
		
		hideLabels: function() {
			L.tileLayer(mapWithoutLabels, {
				id: 'mapbox.light',
				accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
				edgeBufferTiles: 2
			}).addTo(map);
		},
		
		showCountries: function() {
			
			let self = this;
			let sortAmountDesc = function(a, b) {
				return b.amount - a.amount;
			};
			
			mapData = mapData.sort(sortAmountDesc).slice(0, 20);
			barData = mapData.sort(sortAmountDesc).slice(0, 20);
			
			let min = mapData[19].amount;
			let max = mapData[0].amount;
			
			function styleFeature(feature) {
				
				let result;
				
				mapData.forEach(function(row) {
					
					if (feature.properties.NAME === row.country) {
						//console.log(row.amount / 100)
						result = {
							fillColor: '#E66200',
							weight: .25,
							opacity: 1, // stroke opacity
							color: 'black',
							fillOpacity: (row.amount / max) * .4 + .3
							//fillOpacity: row.amount / 100
						};
					}
				});
				
				if (result) return result;
				
				return { // for countries not selected otherwise will show the default fill
					fillColor: 'red',
					weight: 2,
					opacity: 0,
					color: 'black',
					fillOpacity: 0
				};
			}
			
			countriesLayer = L.geoJson(geojson, {
				style: styleFeature,
				onEachFeature: self.eachGeoFeature
			});
			countriesLayer.addTo(map);
		},
		
		eachGeoFeature: function(feature, layer) {
			
			layer.on({
				mouseover: function(d) {
					
					//d.target.feature.bindTooltip("my tooltip text").openTooltip();
					let countryName = d.target.feature.properties.NAME_EN;
					
					
					//L.polygon(d.target.feature.geometry.coordinates).bindTooltip("my tooltip").addTo(map);
					
					//console.log(d.target.feature.geometry.coordinates[0][0][0]);
				},
				mouseout: function() {
					//console.log('out');
				},
				click: function() {
					//console.log('click');
				}
			});
		},
		
		addBarGraph: function () {
			
			let self = this;
				
			graph = document.querySelector('.geo-vis .bar-graph');
			
			let graphicContainer = graph.parentElement;
			barPadding = {
				top: 60,
				right: 100,
				bottom: 80,
				left: 150
			};
			
			var barGraphHeight = 425;
			var barHeight = 7;
			barWidth = graphicContainer.offsetWidth - barPadding.left - barPadding.right;
			barGraphInnerHeight = barGraphHeight - barPadding.top - barPadding.bottom;

			let maxValue = d3.max(mapData, function (d) {
				return d.amount;
			});
			
			let compare = function(a, b) { // sort vertical direction of bars
				return a.amount - b.amount;
			};
			
			mapData = mapData.sort(compare);
			
			let top = mapData.slice(0)[19];
			let worldPercent = Math.round(10*worldTotal/top.amount)/10;
			self.updateStats(worldPercent, top.country, top.amount);
			
			let count = 21;
			var y = d3.scaleBand().domain(mapData.map(function (d) {
				return d.country;
			})).range([barGraphInnerHeight, 0]);
			var x = d3.scaleLinear().domain([0, maxValue]).range([0, barWidth - 100]);

			var svg = d3.select(graph).append('svg')
			.attr('width', barWidth + barPadding.left + barPadding.right)
			.attr('height', barGraphInnerHeight + barPadding.top + barPadding.bottom)
			.append('g')
			.attr('transform', 'translate(' + barPadding.left + ',' + barPadding.top + ')');
			
			svg.selectAll('.bar')
			.data(mapData)
			.enter()
			// .append('rect').attr('height', barHeight).attr('barWidth', function(d) { // make clear hover interaction
			// 	return x(d.amount);
			// }).style('fill', 'red').attr('y', function (d) {
			// 	return y(d.country) + (y.bandwidth());
			// })
			.append('rect')
			.on('mouseover', function(event) {
				d3.event.target.style.fill = selectColor;
			})
            .on('mouseout', function() {
				d3.event.target.style.fill = defaultColor;
			})
			.on('click', function(d) {
				// console.log(d);
				// console.log(worldTotal, d.amount);
				
				let percentage = Math.round(10*parseInt(d.amount)/worldTotal)/10;
				if (percentage < 1) Math.round(100*parseInt(d.amount)/worldTotal)/100
				
				self.updateStats(percentage, d.country, d.amount); // why is percent wrong?
			})
			.attr('class', 'bar')
			.attr('y', function (d) {
				return y(d.country) + (y.bandwidth() / 2 - barHeight / 2);
			})
			.attr('height', barHeight)
			.attr('width', 0)
			.transition()
			.delay(function(d, i) { return i * 40; })
			.ease(d3.easeCubicOut)
			.duration(300)
			.attr('width', function(d) {
				return x(d.amount);
			});
			
			svg.append('g').attr('transform', 'translate(0,' + (barGraphInnerHeight + 6) + ')').call(d3.axisBottom(x));
			svg.append('g').call(d3.axisLeft(y).tickSize(0));
			
			let titleHeight = 20;
			barGraphTitle = svg.append('text') 
				.attr('class', 'x-axis-label')
				.html('Top 20 Global Plastic Exporters (USD)');
			let textWidth = barGraphTitle.node().getBBox().width;
			let textHeight = barGraphTitle.node().getBBox().height;
			barGraphTitle.attr('transform','translate(' + (barWidth/2 - (textWidth/2) - (barPadding.left/2)) + ', ' + (barGraphInnerHeight + titleHeight + (barPadding.bottom/2)) + ')');
		},
		
		updateStats: function(percent, region, value) {
			
			let country = document.querySelector('.geo-vis .stats .country');
			let percentageOfTotal = document.querySelector('.geo-vis .stats .percentage-of-total');
			let valuation = document.querySelector('.geo-vis .stats .valuation span');
			
			country.textContent = region;
			percentageOfTotal.textContent = percent + '%';
			valuation.textContent = parseInt(value).toLocaleString();
			
		},
		
		setStatsLabel: function(label) {
			
			let labelElement = document.querySelector('.geo-vis .stats .label');
			labelElement.textContent = label;
		},
		
		bindUI: function() {
			
			let self = this;
			
			let exportsButton = document.querySelector('#plasticExports');
			if (exportsButton) exportsButton.addEventListener('click', function() {
				mapData = exportsData;
				self.reset();
				self.showCountries();
				self.addBarGraph();
				self.setStatsLabel(exportsStatsLabel);
				barGraphTitle.html('Top 20 Global Plastic Exporters (USD)');
			});
			
			let importsButton = document.querySelector('#plasticImports');
			if (importsButton) importsButton.addEventListener('click', function() {
				mapData = importsData;
				self.reset();
				
				self.showCountries();
				self.addBarGraph();
				self.setStatsLabel(exportsStatsLabel);
				barGraphTitle.html('Top 20 Global Plastic Importers (USD)');
			});
			
			let mismanagedButton = document.querySelector('#plasticMismanaged');
			if (mismanagedButton) mismanagedButton.addEventListener('click', function() {
				mapData = mismanagedData;
				self.reset();
				
				self.showCountries();
				self.addBarGraph();
				self.setStatsLabel(exportsStatsLabel);
				barGraphTitle.html('Percentage of Country\'s Plastic Waste that is Mismanaged, Global Top 20');
				let textWidth = barGraphTitle.node().getBBox().width;
				let textHeight = barGraphTitle.node().getBBox().height;
				barGraphTitle.attr('transform','translate(' + (barWidth/2 - (textWidth/2) - (barPadding.left/2)) + ', ' + (barGraphInnerHeight + textHeight + (barPadding.bottom/2)) + ')');
			});
		},
		
		reset: function() {
			
			graph.innerHTML = '';
			countriesLayer.remove();
		}
	}
}