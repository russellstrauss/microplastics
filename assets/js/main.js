// Import vendors first
import './vendors.js';

// Import utilities
import './utils.js';

// Import components
import HorizontalBar from './components/horizontal-bar.js';
import PlasticLongevity from './components/plastic-longevity.js';
import Maps from './components/maps.js';
import Sunburst from './components/sunburst.js';
import Projections from './components/projections.js';

document.addEventListener('DOMContentLoaded', function() {
	HorizontalBar().init();
	PlasticLongevity().init();
	Maps().init();
	Sunburst().init();
	Projections().init();
});