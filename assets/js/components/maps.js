module.exports = function() {
	
	var containerWidth = parseInt(document.querySelector('.map').offsetWidth);
	
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

			var projection = asia.projection;
			var path = d3.geoPath().projection(projection);
			var svg = d3.select('.map').append('svg').attr('width', containerWidth);

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