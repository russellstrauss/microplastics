module.exports = function() {
	
	return {
		
		settings: {
			
		},
		
		init: function() {

			let self = this;
			
			let fullScreenMap = document.querySelector('.fullscreen-map');
			let veil = fullScreenMap.querySelector('.veil');
			
			// var waypoint = new Waypoint({
			// 	element: document.getElementById('references'),
			// 	handler: function() {
			// 		veil.classList.remove('active');
			// 	},
			// 	offset: 500
			// });
			
			var intro = document.querySelector('.intro');
			
			var waypoint = new Waypoint({
				element: intro,
				handler: function(direction) {
					
					if (direction === 'down') {
						veil.classList.remove('active');
					}
					else {
						veil.classList.add('active');
					}
				},
				offset: -intro.offsetHeight + 300
			});
		}
	}
}