require('leaflet-arc');

module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	var mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var graph, countriesLayer, barGraphTitle;
	var mapData, exportsData, importsData, geojson, toolTip, barData;
	
	var china = {
		location: new L.LatLng(23.638, 120.998),
		zoom: 3
	}
	
	var center = {
		location: new L.LatLng(30, 20),
		zoom: 1.5
	}
	
	var setLocation = center;
	
	var map = L.map('map', { zoomControl: false }).setView(setLocation.location, setLocation.zoom);
	var svg = d3.select('#map').select('svg');
	var pointsGroup = svg.select('g').attr('class', 'points').append('g');
	
	var svgLayer = L.svg();
	svgLayer.addTo(map);
	
	return {
		
		settings: {
			barHeight: 400
		},
		
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
				if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === ' World') {
					row.region = d['Partner Name'];
				}
				else {
					row.country = d['Partner Name'];
				}
				
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
					if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === ' World') {
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
			
			let sortAmountDesc = function(a, b) {
				return b.amount - a.amount;
			};
			
			mapData = mapData.sort(sortAmountDesc).slice(0, 20);
			barData = mapData.sort(sortAmountDesc).slice(0, 20);
			
			let min = mapData[19].amount;
			let max = mapData[0].amount;
			
			function style(feature) {
				
				let result;
				
				mapData.forEach(function(row) {
					
					if (feature.properties.NAME === row.country) {
						result = {
							fillColor: '#E66200',
							weight: .25,
							opacity: 1, // stroke opacity
							color: 'black',
							fillOpacity: (row.amount / max) * .4 + .3
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
			
			countriesLayer = L.geoJson(geojson, {style: style});
			countriesLayer.addTo(map);
		},
		
		addBarGraph: function () {
			
			let self = this;
				
			graph = document.querySelector('.geo-vis .bar-graph');
			
			let graphicContainer = graph.parentElement;
			var padding = {
				top: 60,
				right: 100,
				bottom: 80,
				left: 150
			};
			
			var width = graphicContainer.offsetWidth - padding.left - padding.right;
			var height = self.settings.barHeight - padding.top - padding.bottom;
			var barHeight = 5;
			
			let maxValue = d3.max(mapData, function (d) {
				return d.amount;
			});
			
			let compare = function(a, b) { // sort vertical direction of bars
				return a.amount - b.amount;
			};
			
			mapData = mapData.sort(compare);

			let count = 21;
			var y = d3.scaleBand().domain(mapData.map(function (d) {
				return d.country;
			})).range([height, 0]);
			var x = d3.scaleLinear().domain([0, maxValue]).range([0, width - 100]);

			var svg = d3.select(graph).append('svg')
			.attr('width', width + padding.left + padding.right)
			.attr('height', height + padding.top + padding.bottom)
			.append('g')
			.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

			svg.selectAll('.bar')
			.data(mapData)
			.enter().append('rect')
			.attr('class', 'bar')
			.attr('width', function(d) {
				return x(d.amount);
			})
			.attr('y', function (d) {
				return y(d.country) + (y.bandwidth() / 2 - barHeight / 2);
			})
				.attr('height', barHeight);

			svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
			svg.append('g').call(d3.axisLeft(y).tickSize(0));
			
			let xAxisHeight = 20;
			barGraphTitle = svg.append('text') 
				.attr('class', 'x-axis-label')
				.html('Top 20 Global Plastic Exporters (USD)');
			let textWidth = barGraphTitle.node().getBBox().width;
			let textHeight = barGraphTitle.node().getBBox().height;
			barGraphTitle.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (height + xAxisHeight + (padding.bottom/2)) + ')');
		},
		
		bindUI: function() {
			
			let self = this;
			
			let exportsButton = document.querySelector('#plasticExports');
			if (exportsButton) exportsButton.addEventListener('click', function() {
				mapData = exportsData;
				self.reset();
				self.showCountries();
				self.addBarGraph();
			});
			
			let importsButton = document.querySelector('#plasticImports');
			if (importsButton) importsButton.addEventListener('click', function() {
				mapData = importsData;
				self.reset();
				
				barGraphTitle = svg.append('text').html('Top 20 Global Plastic Importers (USD)');
				self.showCountries();
				self.addBarGraph();
			});
		},
		
		reset: function() {
			
			graph.innerHTML = '';
			countriesLayer.remove();
		}
	}
}