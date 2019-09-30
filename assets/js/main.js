var Graph = require('./components/graph.js');
var Graph2 = require('./components/graph-2.js');
var Graph3 = require('./components/graph-3.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded',function(){

		Graph().init();
		Graph2().init();
		Graph3().init();
	});
})();