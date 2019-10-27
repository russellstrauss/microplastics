module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	var map, zoom, center;
	
	var asia = {
		width: containerWidth,
		height: 800,
		scale: 800
	};
	//asia.projection = d3.geoMercator().translate([asia.width * .25, asia.height * .75]).scale([asia.scale]);
	asia.projection = d3.geoMercator().center([-84.386330, 33.753746]).scale(1500);
	
	return {
		
		init: function() {

			let self = this;

			self.zoomMap();
			self.setScrollPoints();
		},
		
		zoomMap: function() {
			
			let mapContainer = document.querySelector('.fullscreen-map');
			var projection = d3.geoMercator().translate([0, 0]);
			var path = d3.geoPath().projection(projection);
				
			//Define quantize scale to sort data values into buckets of color
			var color = d3.scaleQuantize().range(['rgb(237,248,233)','rgb(186,228,179)','rgb(116,196,118)','rgb(49,163,84)','rgb(0,109,44)']);
								//Colors taken from colorbrewer.js, included in the D3 download

			//Number formatting for population values
			var formatAsThousands = d3.format(',');  //e.g. converts 123456 to '123,456'

			//Create SVG element
			var svg = d3.select('.fullscreen-map')
						.append('svg')
						.attr('width', containerWidth)
						.attr('height', containerHeight);

			//Define what to do when panning or zooming
			var zooming = function(d) {

				//Log out d3.event.transform, so you can see all the goodies inside
				//console.log(d3.event.transform);

				//New offset array
				var offset = [d3.event.transform.x, d3.event.transform.y];

				//Calculate new scale
				var newScale = d3.event.transform.k * 2000;

				//Update projection with new offset and scale
				projection.translate(offset).scale(newScale);

				//Update all paths and circles
				svg.selectAll('path')
					.attr('d', path);

				svg.selectAll('circle').attr('cx', function(d) {
					return projection([d.lon, d.lat])[0];
				})
				.attr('cy', function(d) {
					return projection([d.lon, d.lat])[1];
				});

			}

			//Then define the zoom behavior
			zoom = d3.zoom()
			.scaleExtent([ 0.2, 2.0 ])
			.translateExtent([[ -1200, -700 ], [ 1200, 700 ]])
			.on('zoom', zooming);

			//The center of the country, roughly
			center = projection([-97.0, 39.0]);

			//Create a container in which all zoom-able elements will live
			map = svg.append('g')
			.attr('id', 'map')
			.call(zoom)  //Bind the zoom behavior
			.call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
			.translate(containerWidth/2, containerHeight/2)
			.scale(0.25)
			.translate(-center[0], -center[1]));

			//Create a new, invisible background rect to catch zoom events
			map.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', containerWidth)
			.attr('height', containerHeight)
			.attr('opacity', 0);
			
			d3.json('./assets/js/data/world_oceans.json', function(json) {
				
				//Bind data and create one path per GeoJSON feature
				svg.selectAll('path')
				.data(json.features)
				.enter()
				.append('path')
				.attr('d', path)
				.style('fill', '#033649').style('opacity', '.5');
			});
			
			d3.json('./assets/js/data/world_countries_small.json', function(json) {
				
				//Bind data and create one path per GeoJSON feature
				svg.selectAll('path')
				.data(json.features)
				.enter()
				.append('path')
				.attr('d', path)
				.style('stroke', 'black').style('opacity', '.5')
				.style('fill', 'white');
			});
				
			//This triggers a zoom event, translating by x, y
			//map.transition().call(zoom.translateBy, x, y);
			//This triggers a zoom event, scaling by 'scaleFactor'
			//map.transition().call(zoom.scaleBy, scaleFactor);
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
						self.resetMap();
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
		
		resetMap: function() {
			map.transition()
			.duration(1200)
			.ease(d3.easePolyInOut.exponent(4))
			.call(zoom.transform, d3.zoomIdentity  //Same as the initial transform
			.translate(containerWidth/2, containerHeight/2)
			.scale(0.25)
			.translate(-center[0], -center[1]));
		},
		
		oldMap: function() {
			
			let self = this;
			
			var projection = asia.projection;
			var path = d3.geoPath().projection(projection);
			var svg = d3.select('.map').append('svg').attr('width', containerWidth);
			
			let step = document.querySelector('#step1');
			let enter = new Waypoint({
				element: step,
				handler: function(direction) {
					
					if (direction === 'down') {
						//veil.classList.remove('active');
						alert('down step 1');
						projection.translate([1000, 0]);
					}
					else {
						alert('up step 1');
						//veil.classList.add('active');
						projection.translate([-1000, 0]);
					}
				}
			});
			
			// svg.selectAll('path')
			// .transition()
			// .duration(750)
			// .call(
			// 	//projection.translate([100, 0])
			// );
			

			d3.json('./assets/js/data/world_oceans.json').then(function(json){
				//Bind data and create one path per GeoJSON feature
				svg.selectAll('path')
					.data(json.features)
					.enter()
					.append('path')
					.attr('d', path)
					.style('fill', '#033649').style('opacity', '.25');
			});

			d3.json('./assets/js/data/world_rivers.json').then(function(json){
				//Bind data and create one path per GeoJSON feature
				svg.selectAll('path')
					.data(json.features)
					.enter()
					.append('path')
					.attr('d', path)
					.style('fill', '#57C3E3');
			});
		}
	}
}