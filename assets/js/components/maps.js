require('leaflet-arc');

module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	var mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	var exportsData, geojson, toolTip;
	
	var china = {
		location: new L.LatLng(23.638, 120.998),
		zoom: 3
	}
	
	var center = {
		location: new L.LatLng(30, 20),
		zoom: 2.5
	}
	
	var setLocation = center;
	
	var map = L.map('map', { zoomControl: false }).setView(setLocation.location, setLocation.zoom);
	var svg = d3.select('#map').select('svg');
	var pointsGroup = svg.select('g').attr('class', 'points').append('g');
	
	var svgLayer = L.svg();
	svgLayer.addTo(map);
	
	return {
		
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
				
				d3.csv("./assets/js/data/exports.csv", prepare).then(function(data) {
					exportsData = data;
					
					self.showCountries();
				});
				
				function prepare(d) {
					//return d;
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
				format: 'jpg70'
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
							weight: 2,
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
		}
	}
}