var HorizontalBar = require('./components/horizontal-bar.js');
var Maps = require('./components/maps.js');
var Scrolling = require('./components/scrolling.js');
var Graph = require('./components/graph.js');
var Graph2 = require('./components/graph-2.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded',function(){
		
		HorizontalBar().init();
		Maps().init();
		Scrolling().init();
		Graph().init();
		Graph2().init();
	});
})();