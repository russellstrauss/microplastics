var HorizontalBar = require('./components/horizontal-bar.js');
var PlasticLongevity = require('./components/plastic-longevity.js');
var Maps = require('./components/maps.js');
var Sunburst = require('./components/sunburst.js');
var ParallelCoordinates = require('./components/parallel-coordinates.js');
var CumulativePlastic = require('./components/cumulative-plastics.js');
var Projections = require('./components/projections.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded', function() {
		
		HorizontalBar().init();
		PlasticLongevity().init();
		Maps().init();
		Sunburst().init();
		ParallelCoordinates().init();
		Projections().init();
		CumulativePlastic().init();
	});
})();