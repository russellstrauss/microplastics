require('leaflet-arc');

module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	let mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	let mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}';
	
	var asia = {
		width: containerWidth,
		height: 800,
		scale: 800
	};
	var china = {
		lat: 23.638,
		long: 120.998
	}
	
	var chinaLocation = new L.LatLng(china.lat, china.long);
	var map = L.map('map', { zoomControl: false }).setView(chinaLocation, 5);
	var svg = d3.select('#map').select('svg');
	var pointsGroup = svg.select('g').attr('class', 'points').append('g');
	
	var svgLayer = L.svg();
	svgLayer.addTo(map);
	
	return {
		
		init: function() {

			let self = this;
			
			self.map();
			self.showCountries();
			self.exports();
			//self.flightPaths();
			// self.setScrollPoints();
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
			
			d3.csv("./assets/js/data/exports.csv", prepare).then(function(data) {
				//console.log(data);
				
				// data = d3.nest().key(function(d) {
				// 	return d.category;
				// })
				// .entries(fate);
				
				// console.log(data);
			});

			function prepare(d) {
				let row = [];
				row.amount = d['2017'];
				row.country = d['Partner Name'];
				if (row.amount !== '') return row;
			}
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
			
			d3.json('./assets/js/data/ne_10m_admin_0_countries.json').then(function(json){
				
				function style(feature) {
					//console.log(feature.properties.NAME);
					
					// if (feature.properties.NAME === 'China') {
					// 	return {
					// 		fillColor: 'yellow',
					// 		weight: 2,
					// 		opacity: .5,
					// 		color: 'black',
					// 		fillOpacity: 0.5
					// 	};
					// }
					
					// return {
					// 	fillColor: 'red',
					// 	weight: 2,
					// 	opacity: .5,
					// 	color: 'black',
					// 	fillOpacity: 0.5
					// };
				}
				
				// var countriesLayer = L.geoJson(json, {style: style});
				// countriesLayer.addTo(map);
			});
		},
		
		flightPaths: function() {
			
			// var arc = L.Polyline.Arc([23.697809, 120.960518], [35.689487, 139.691711], {
			// 	color: 'rgba(255, 225, 255, .5)',
			// 	vertices: 250
			// }).addTo(map);
			
			var snapMap = Snap("#map");
			var g = Snap("#svgElem");
			if (g) {
				
				var rect = g.select('#rect'),
				invisiblePath = g.select('#followPath_invisible'), 
				//invisiblePath = snapMap.select('path'), 
				lenPath = Snap.path.getTotalLength(invisiblePath.attr("d")), 
				path0Pos = invisiblePath.getPointAtLength(0);
				
				rect.attr({
					transform: 't' + [path0Pos.x, path0Pos.y] + 'r' + (path0Pos.alpha - 90)
				});
				
				Snap.animate(0, lenPath, function(val) {
					var pos = invisiblePath.getPointAtLength(val);
	
					rect.attr({
						transform: 't' + [pos.x, pos.y] + 'r' + (pos.alpha - 90)
					});
				}, 4000, mina.easeinout);
			}
		}
	}
}