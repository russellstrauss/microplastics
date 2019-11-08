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
					element: document.querySelector('.pagination'),
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
			}
		}
	}
}