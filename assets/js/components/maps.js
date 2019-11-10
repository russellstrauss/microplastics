module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	var map, zoom, center;
	
	var asia = {
		width: containerWidth,
		height: 800,
		scale: 800
	};
	var china = {
		lat: 23.638,
		long: 120.998
	}
	//asia.projection = d3.geoMercator().translate([asia.width * .25, asia.height * .75]).scale([asia.scale]);
	asia.projection = d3.geoMercator().center([-84.386330, 33.753746]).scale(1500);
	
	return {
		
		init: function() {

			let self = this;
			
			self.v5Map();
			// self.setScrollPoints();
		},
		
		setScrollPoints: function() {
			
			let self = this;
			let veil = document.querySelector('.veil');
			
			var waypoint = new Waypoint({
				element: document.getElementById('showAsia'),
				handler: function(direction) {
					
					if (direction === 'down') {
						map.transition()
						.duration(2000)
						.ease(d3.easeCubicInOut)
						.call(zoom.transform, d3.zoomIdentity
						.translate(containerWidth/2, containerHeight/2)
						.scale(.5)
						.translate(-4000, 500));
					}
					else {
						veil.classList.add('active');
						//self.resetMap();
					}
				},
				offset: 0
			});
			
			waypoint = new Waypoint({
				element: document.getElementById('showAsia'),
				handler: function(direction) {
					
					if (direction === 'down') {
						veil.classList.remove('active');
					}
					else {
						//veil.classList.add('active');
					}
				},
				offset: 500
			});
			
			waypoint = new Waypoint({
				element: document.getElementById('showUS'),
				handler: function(direction) {
					
					if (direction === 'down') {
						map.transition()
						.duration(1200)
						.ease(d3.easeCubicInOut)
						.call(zoom.transform, d3.zoomIdentity
						.translate(containerWidth/2, containerHeight/2)
						.scale(.75)
						.translate(2500, 1500));
					}
					else {
						//veil.classList.add('active');
					}
				}
			});
			
			waypoint = new Waypoint({
				element: document.getElementById('showJapan'),
				handler: function(direction) {
					
					if (direction === 'down') {
						map.transition()
						.duration(1200)
						.ease(d3.easeCubicInOut)
						.call(zoom.transform, d3.zoomIdentity
						.translate(containerWidth/2, containerHeight/2)
						.scale(1)
						.translate(-4500, 1650));
					}
					else {
						//veil.classList.add('active');
					}
				},
				offset: 800
			});
		},
		
		v5Map: function() {
			var map = d3.select('.fullscreen-map');
			var mapWidth = parseInt(map.offsetWidth);
			var mapHeight = parseInt(map.offsetHeight);
			var atlLatLng = new L.LatLng(33.7771, -84.3900);
			var chinaLocation = new L.LatLng(china.lat, china.long);
			var myMap = L.map('map').setView(chinaLocation, 5);
			var vertices = d3.map();
			var activeMapType = 'nodes_links';

			L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}', {
				maxZoom: 10,
				minZoom: 3,
				id: 'mapbox.light',
				accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA'
			}).addTo(myMap);

			var svgLayer = L.svg();
			svgLayer.addTo(myMap)

			var svg = d3.select('#map').select('svg');
			var nodeLinkG = svg.select('g')
			.attr('class', 'leaflet-zoom-hide');

			function updateLayers() {
				nodeLinkG.selectAll('.grid-node')
				.attr('cx', function(d){return myMap.latLngToLayerPoint(d.LatLng).x})
				.attr('cy', function(d){return myMap.latLngToLayerPoint(d.LatLng).y});
				
				nodeLinkG.selectAll('.grid-link')
				.attr('x1', function(d){return myMap.latLngToLayerPoint(d.node1.LatLng).x})
				.attr('y1', function(d){return myMap.latLngToLayerPoint(d.node1.LatLng).y})
				.attr('x2', function(d){return myMap.latLngToLayerPoint(d.node2.LatLng).x})
				.attr('y2', function(d){return myMap.latLngToLayerPoint(d.node2.LatLng).y});
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
		}
	}
}