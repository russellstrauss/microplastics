module.exports = function() {
	
	return {
		
		settings: {
			options: [
				'option 1',
				'option 2',
				'option 3'
			]
		},
		
		init: function() {

			let self = this;
			
			self.pagination();
			
			let cycle = document.querySelector('.cycle');
		},
		
		pagination: function() {

			let pagination = document.querySelector('.pagination');
			
			if (pagination) {
				
				var waypoint = new Waypoint({
					element: pagination,
					handler: function(direction) {
						
						if (direction === 'down') {
							pagination.classList.add('active');
						}
						else {
							pagination.classList.remove('active');
						}
					},
					offset: 249
				});
								
				let graphic = document.querySelector('.plastic-longevity');
				var hidePagination = new Waypoint({
					element: graphic,
					handler: function(direction) {
						
						if (direction === 'down') {
							pagination.style.opacity = "0";
						}
						else {
							pagination.style.opacity = "1";
						}
					},
					offset: 800
				});
				
				var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
				
				console.log(scrollTop);
			}
		}
	}
}