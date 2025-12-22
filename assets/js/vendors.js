// Vendor libraries are loaded as global scripts in index.html
// This file ensures leaflet-arc is loaded from node_modules
// and provides a place for any other vendor setup if needed

// Import leaflet from npm and make it globally available
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Make Leaflet available globally for vendor scripts and components that use L directly
window.L = L;

// Import leaflet plugins that depend on L being available
import '../vendors/js/leaflet.edgebuffer.js';

// Import leaflet-arc from node_modules (it should work with ES modules now that L is available)
import 'leaflet-arc';

