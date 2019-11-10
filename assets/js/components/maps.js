module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	
	var asia = {
		width: containerWidth,
		height: 800,
		scale: 800
	};
	var china = {
		lat: 23.638,
		long: 120.998
	}
	var atl = new L.LatLng(33.7771, -84.3900);
	//var map = L.map('map').setView(atl, 5);
	var chinaLocation = new L.LatLng(china.lat, china.long);
	var map = L.map('map').setView(chinaLocation, 5);
	
	var svgLayer = L.svg();
	svgLayer.addTo(map);
	
	return {
		
		init: function() {

			let self = this;
			
			self.v5Map();
			self.showCountries();
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
		
		v5Map: function() {
			
			var mapElement = d3.select('.fullscreen-map');
			var mapWidth = parseInt(mapElement.offsetWidth);
			var mapHeight = parseInt(mapElement.offsetHeight);
			var atlLatLng = new L.LatLng(33.7771, -84.3900);
			
			
			var vertices = d3.map();
			var activeMapType = 'nodes_links';

			L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}', {
				maxZoom: 10,
				minZoom: 3,
				id: 'mapbox.light',
				accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
				edgeBufferTiles: 2
			}).addTo(map);

			// var svgLayer = L.svg();
			// svgLayer.addTo(map)

			var svg = d3.select('#map').select('svg');
			var nodeLinkG = svg.select('g')
			.attr('class', 'leaflet-zoom-hide');

			function updateLayers() {
				nodeLinkG.selectAll('.grid-node')
				.attr('cx', function(d){return map.latLngToLayerPoint(d.LatLng).x})
				.attr('cy', function(d){return map.latLngToLayerPoint(d.LatLng).y});
				
				nodeLinkG.selectAll('.grid-link')
				.attr('x1', function(d){return map.latLngToLayerPoint(d.node1.LatLng).x})
				.attr('y1', function(d){return map.latLngToLayerPoint(d.node1.LatLng).y})
				.attr('x2', function(d){return map.latLngToLayerPoint(d.node2.LatLng).x})
				.attr('y2', function(d){return map.latLngToLayerPoint(d.node2.LatLng).y});
			}

			d3.selectAll('.btn-group > .btn.btn-secondary').on('click', function() {
				
				var newMapType = d3.select(this).attr('data-type');
				d3.selectAll('.btn.btn-secondary.active').classed('active', false);

				cleanUpMap(activeMapType);
				showOnMap(newMapType);
				activeMapType = newMapType;
			});

			function cleanUpMap(type) {
				switch(type) {
					case 'cleared':
						break;
					case 'nodes_links':
						nodeLinkG.attr('visibility', 'hidden');
						break;
				}
			}

			function showOnMap(type) {
				switch(type) {
					case 'cleared':
						break;
					case 'nodes_links':
						nodeLinkG.attr('visibility', 'visible');
						break;
				}
			}
		},
		
		showCountries: function() {
			
			d3.json('./assets/js/data/ne_10m_admin_0_countries.json').then(function(json){
				
				//console.log(json);
				
				function style(feature) {
					console.log(feature.properties.NAME);
					
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
		}
	}
}