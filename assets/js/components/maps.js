require('leaflet-arc');

module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	var mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var exportsData, importsData, geojson, toolTip, barData;
	
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
			
			d3.json('./assets/js/data/ne_10m_admin_0_countries.json').then(function(json) {
				
				geojson = json;
				
				d3.csv('./assets/js/data/exports.csv', prepare).then(function(data) {
					exportsData = data;
					//console.log(exportsData);
					
					self.showCountries();
					self.addBarGraph();
				});
				
				function prepare(d) {
					//return d;
					//console.log(d);
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
			
			exportsData = exportsData.sort(sortAmountDesc).slice(0, 20);
			barData = exportsData.sort(sortAmountDesc).slice(0, 20);
			//console.log(exportsData);
			
			let min = exportsData[19].amount;
			let max = exportsData[0].amount;
			
			function style(feature) {
				
				let result;
				
				exportsData.forEach(function(exportRow) {
					//console.log(exportRow.country, exportRow.amount / max);
					
					if (feature.properties.NAME === exportRow.country) {
						result = {
							fillColor: '#E66200',
							weight: .25,
							opacity: 1, // stroke opacity
							color: 'black',
							fillOpacity: (exportRow.amount / max) * .4 + .3
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
			
			var countriesLayer = L.geoJson(geojson, {style: style});
			countriesLayer.addTo(map);
		},
		
		addBarGraph: function () {
			
			let self = this;
				
			let graph = document.querySelector('.geo-vis .bar-graph');
			
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
			
			let maxValue = d3.max(exportsData, function (d) {
				return d.amount;
			});
			
			let compare = function(a, b) { // sort vertical direction of bars
				return a.amount - b.amount;
			};
			
			exportsData = exportsData.sort(compare);

			let count = 21;
			var y = d3.scaleBand().domain(exportsData.map(function (d) {
				return d.country;
			})).range([height, 0]);
			var x = d3.scaleLinear().domain([0, maxValue]).range([0, width - 100]);

			var svg = d3.select(graph).append('svg')
			.attr('width', width + padding.left + padding.right)
			.attr('height', height + padding.top + padding.bottom)
			.append('g')
			.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

			svg.selectAll('.bar')
				.data(exportsData)
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
			
			// Add graph title
			// let title = svg.append('text') 
			// 	.attr('class', 'title')
			// 	.text('Top 20 Global Rivers Ranked by Ocean Plastic Input');
			// let textWidth = title.node().getBBox().width;
			// let textHeight = title.node().getBBox().height;
			// title.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (-1 * (padding.top/2) + 10) + ')');
			
			let xAxisHeight = 20;
			let xAxisLabel = svg.append('text') 
				.attr('class', 'x-axis-label')
				.html('Top 20 Global Plastic Exporters (USD)');
			let textWidth = xAxisLabel.node().getBBox().width;
			let textHeight = xAxisLabel.node().getBBox().height;
			xAxisLabel.attr('transform','translate(' + (width/2 - (textWidth/2) - (padding.left/2)) + ', ' + (height + xAxisHeight + (padding.bottom/2)) + ')');
		
			// let yAxisLabel = svg.append('text') 
			// 	.attr('class', 'y-axis-label')
			// 	.text('y-axis label here');
			// textWidth = yAxisLabel.node().getBBox().width;
			// textHeight = yAxisLabel.node().getBBox().height;
			// yAxisLabel.attr('transform','translate(' + (-1 * padding.left + textHeight * 2.5) + ', ' + (height/2 + (textWidth/2)) + ') rotate(-90)');
		}
	}
}