var HorizontalBar = require('./components/horizontal-bar.js');
var PlasticLongevity = require('./components/plastic-longevity.js');
var UI = require('./components/ui.js');
var Maps = require('./components/maps.js');
var Scrolling = require('./components/scrolling.js');
var Sunburst = require('./components/sunburst.js');
var Pie = require('./components/pie.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded',function(){
		
		HorizontalBar().init();
		PlasticLongevity().init();
		UI().init();
		Maps().init();
		Scrolling().init();
		Sunburst().init();
		Pie().init();
	});
})();