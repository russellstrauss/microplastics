export default function() {
	
	let selectColor = '#E66200';
	let defaultColor = '#E6965B';
	
	let exportsStatsLabel = 'total global plastic exports', importsStatsLabel = 'total global plastic imports', mismanagedStatsLabel = 'global share of mismanaged waste';
	
	let containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
	let containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
	let mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
	let mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
	let graph, countriesLayer, barGraphTitle, worldTotal;
	let mapData, exportsData, importsData, mismanagedData, geojson, toolTip, barData, barWidth, barPadding, barGraphInnerHeight, mismanagedDataBoolean;
	
	let china = {
		location: new L.LatLng(23.638, 120.998),
		zoom: 3
	}
	
	let center = {
		location: new L.LatLng(30, 20),
		zoom: 2.5
	}
	
	let mismanagedCenter = {
		location: new L.LatLng(10, 70),
		zoom: 3.5
	}
	
	let setLocation = center;
	
	let map = L.map('map', { 
		zoomControl: false,
		zoomSnap: 0.01
	}).setView(setLocation.location, setLocation.zoom);
	let svg = d3.select('#map').select('svg');
	let pointsGroup = svg.select('g').attr('class', 'points').append('g');
	
	let northwestCorner = L.latLng(120, -171);
	let southeastCorner = L.latLng(-40, 175);
	
	let bounds = L.latLngBounds(northwestCorner, southeastCorner);
	map.setZoom(map.getBoundsZoom(bounds));
	
	let svgLayer = L.svg();
	svgLayer.addTo(map);
	
	return {
		
		init: function() {

			let self = this;
			
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', function() {
					self.map();
					self.exports();
					self.bindUI();
				});
			} else {
				self.map();
				self.exports();
				self.bindUI();
			}
			
			window.addEventListener('resize', function() { // Handle window resize to update map and bar graph
				if (map) {
					setTimeout(function() {
						map.invalidateSize();
					}, 100);
				}
			});
		},
		
		toolTip: function() {
			
			toolTip = d3.tip()
			.attr("class", "d3-tip")
			.offset([-12, 0])
			.html(function(d) {
				return '<div class="tooltip"><h5>'+d['name']+"</h5></div>"
			});
			svg.call(toolTip);
		},
		 
		exports: function() {
			
			let self = this;
			
			d3.csv('./assets/js/data/imports.csv', prepareImports).then(function(data) {
				importsData = data;
			});
			
			function prepareImports(d) {
				let row = [];
				row.amount = d['2017'];
				
				if (d['Partner Name'] === 'World') {
					worldTotal = row.amount;
				}
				
				if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === 'World') {
					row.region = d['Partner Name'];
				}
				else {
					row.country = d['Partner Name'];
				}
				
				if (row.amount !== '' && row.country) return row;
			}
			
			d3.csv('./assets/js/data/mismanagedglobal.csv', prepareMismanaged).then(function(data) {
				mismanagedData = data;
			});
			
			function prepareMismanaged(d) {
				let row = [];
					row.amount = d['Share of plastic inadequately managed (%)'];
					row.country = d['Entity'];
					
					if (row.amount !== '' && row.country) return row;
			}
			
			d3.json('./assets/js/data/ne_10m_admin_0_countries.json').then(function(json) {
				
				geojson = json;
				
				d3.csv('./assets/js/data/exports.csv', prepareExports).then(function(data) {
					exportsData = data;
					mapData = exportsData;
					
					self.showCountries();
					self.addBarGraph();
				});
				
				function prepareExports(d) {
					let row = [];
					row.amount = d['2017'];
					
					if (d['Partner Name'] === 'World') {
						worldTotal = row.amount;
					}
					
					if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === 'World') {
						row.region = d['Partner Name'];
					}
					else {
						row.country = d['Partner Name'];
					}
					
					if (row.amount !== '' && row.country) return row;
				}
			});
		},
		
		map: function() {
			
			let self = this;
			let mapElement = d3.select('.fullscreen-map');
			let mapWidth = parseInt(mapElement.offsetWidth);
			let mapHeight = parseInt(mapElement.offsetHeight);
			
			if (mapWidth <= 0 || mapHeight <= 0) { // Ensure map container has valid dimensions before initializing
				
				setTimeout(function() { // Wait for container to be properly sized
					self.map();
				}, 100);
				return;
			}
			
			let vertices = d3.map();
			let activeMapType = 'nodes_links';
			
			map.invalidateSize();
			
			L.tileLayer(mapWithoutLabels, {
				subdomains: 'abcd',
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				edgeBufferTiles: 2,
				reuseTiles: true,
				noWrap: true,
				errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
				maxZoom: 18,
				minZoom: 1
			}).addTo(map);
			
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
		},
		
		showLabels: function() {
			L.tileLayer(mapWithLabels, {
				subdomains: 'abcd',
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				edgeBufferTiles: 2,
				errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
				maxZoom: 18,
				minZoom: 1
			}).addTo(map);
		},
		
		hideLabels: function() {
			L.tileLayer(mapWithoutLabels, {
				subdomains: 'abcd',
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				edgeBufferTiles: 2,
				errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
				maxZoom: 18,
				minZoom: 1
			}).addTo(map);
		},
		
		showCountries: function() {
			
			let self = this;
			let sortAmountDesc = function(a, b) {
				return b.amount - a.amount;
			};
			
			mapData = mapData.sort(sortAmountDesc).slice(0, 20);
			barData = mapData.sort(sortAmountDesc).slice(0, 20);
			
			let min = mapData[19].amount;
			let max = mapData[0].amount;
			
			function styleFeature(feature) {
				
				let result;
				
				mapData.forEach(function(row) {
					
					if (feature.properties.NAME === row.country) {

						result = {
							fillColor: '#E66200',
							weight: .25,
							opacity: 1, // stroke opacity
							color: 'black',
							fillOpacity: (row.amount / max) * .4 + .3
						};
					}
				});
				
				if (result) return result;
				
				return { // for countries not selected otherwise will show the default fill
					fillColor: 'red',
					weight: 2,
					opacity: 0,
					color: 'black',
					fillOpacity: 0
				};
			}
			
			countriesLayer = L.geoJson(geojson, {
				style: styleFeature,
				onEachFeature: self.eachGeoFeature
			});
			countriesLayer.addTo(map);
		},
		
		eachGeoFeature: function(feature, layer) {

			let popup;
			
			layer.on({
				mouseover: function(d) {
				
					let countryName = d.target.feature.properties.NAME_EN;
					let countryExports = '';
					let countryImports = '';
					let countryMismanaged = '';
					
					let hoveredCountryExports = exportsData.filter(function(row) {
												
						if (row.country === countryName) return row;
					});
					let hoveredCountryImports = importsData.filter(function(row) {
						if (row.country === countryName) return row;
					});
					let hoveredCountryMismanaged = mismanagedData.filter(function(row) {
						if (row.country === countryName) return row;
					});
					
					if (hoveredCountryExports[0]) {
						countryExports = parseInt(hoveredCountryExports[0].amount).toLocaleString();
					}
					if (hoveredCountryImports[0]) {
						countryImports = parseInt(hoveredCountryImports[0].amount).toLocaleString();
					}
					if (hoveredCountryMismanaged[0]) {
						countryMismanaged = hoveredCountryMismanaged[0].amount;
					}
					
					let markup = '<div class="popup-custom">';
					markup += '<h4 class="country">' + countryName + '</h4>';
					markup += '<div class="exports"><strong>Total exports (USD):</strong> $' + countryExports + '</div>';
					markup += '<div class="imports"><strong>Total imports (USD):</strong> $' + countryImports + '</div>';
					if (countryMismanaged) markup += '<div class="mismanaged"><strong>Global share of mismanaged waste:</strong> ' + countryMismanaged + '%</div>';
					markup += '</div>';
					
					
					popup = L.popup({
						minWidth: 500
					}, countriesLayer)
					.setLatLng(d.latlng)
					.setContent(markup)
					.openOn(map);
				},
				mouseout: function(d) {
					
					if (popup && !d.originalEvent.toElement.classList.contains('leaflet-popup-content-wrapper')) { // don't hide when moving mouse into the popup
						popup.remove();
					}
				},
				click: function() {
				}
			});
		},
		
		addBarGraph: function () {
			
			let self = this;
				
			graph = document.querySelector('.geo-vis .bar-graph');
			
			let graphicContainer = graph.parentElement;
			barPadding = { top: 60, right: 100, bottom: 120, left: 200 };
			if (utils.mobile()) barPadding = { top: 20, right: 0, bottom: 120, left: 120 };
			
			let barGraphHeight = 425;
			let barHeight = 7;
			barWidth = graphicContainer.offsetWidth - barPadding.left - barPadding.right;
			
			barWidth = Math.max(100, barWidth); // Ensure minimum width
			barGraphInnerHeight = barGraphHeight - barPadding.top - barPadding.bottom;

			let maxValue = d3.max(mapData, function (d) {
				return +d.amount;
			});
			
			let compare = function(a, b) { // sort vertical direction of bars
				return a.amount - b.amount;
			};
			
			mapData = mapData.sort(compare);
			
			let top = mapData.slice(0)[19];
			let worldPercent;
			if (mismanagedDataBoolean) {
				worldPercent = top.amount;
			}
			else {
				worldPercent = worldTotal/top.amount;
			}
			self.updateStats(worldPercent, top.country, top.amount);
			
			let count = 21;
			let y = d3.scaleBand().domain(mapData.map(function (d) {
				return d.country;
			})).range([barGraphInnerHeight, 0]);
			
			let maxBarWidth = Math.max(50, barWidth - 50);// Ensure x scale range is always positive
			let x = d3.scaleLinear().domain([0, maxValue]).range([0, maxBarWidth]);

			let svg = d3.select(graph).append('svg')
			.attr('width', barWidth + barPadding.left + barPadding.right)
			.attr('height', barGraphInnerHeight + barPadding.top + barPadding.bottom)
			.append('g')
			.attr('transform', 'translate(' + barPadding.left + ',' + barPadding.top + ')');
			
			svg.selectAll('.bar')
			.data(mapData)
			.enter()
			.append('rect')
			.on('mouseover', function(d) {
				d3.event.target.style.fill = selectColor;
				
				let percentage = ((parseInt(d.amount)/parseInt(worldTotal)) * 100);
				if (mismanagedDataBoolean) self.updateStats(d.amount, d.country, '')
				else {
					self.updateStats(percentage, d.country, d.amount);
				}
			})
            .on('mouseout', function() {
				d3.event.target.style.fill = defaultColor;
			})
			.on('click', function(d) {
				
			})
			.attr('class', 'bar')
			.attr('y', function (d) {
				return y(d.country) + (y.bandwidth() / 2 - barHeight / 2);
			})
			.attr('height', barHeight)
			.attr('width', 0)
			.transition()
			.delay(function(d, i) { return i * 40; })
			.ease(d3.easeCubicOut)
			.duration(300)
			.attr('width', function(d) {
				let width = x(d.amount);
				return Math.max(0, width); // Ensure width is never negative
			});
			
			svg.append('g').attr('transform', 'translate(0,' + (barGraphInnerHeight + 6) + ')')
			.call(d3.axisBottom(x).tickFormat(function(d) {
				return Math.round(d / 1000000);
			}));
			svg.append('g').call(d3.axisLeft(y).tickSize(0));
			
			let titleHeight = 20;
			barGraphTitle = svg.append('text').attr('class', 'x-axis-label').html('Top 20 Global Plastic Exporters');
			let textWidth = barGraphTitle.node().getBBox().width, textHeight = barGraphTitle.node().getBBox().height;
			barGraphTitle.attr('transform','translate(' + (barWidth/2 - (textWidth/2) - (barPadding.left/2)) + ', ' + (barGraphInnerHeight + titleHeight + (barPadding.bottom/2)) + ')');
			let barGraphUnits = svg.append('text').attr('class', 'x-axis-label-2').html('in millions of USD $');
			let unitTextWidth = barGraphUnits.node().getBBox().width, unitTextHeight = barGraphUnits.node().getBBox().height;
			barGraphUnits.attr('transform','translate(' + (barWidth/2 - (unitTextWidth/2) - (barPadding.left/2)) + ', ' + (barGraphInnerHeight + unitTextHeight + (barPadding.bottom/2) + 30) + ')');
		},
		
		updateStats: function(percent, region, value) {
			
			let country = document.querySelector('.geo-vis .stats .country');
			let percentageOfTotal = document.querySelector('.geo-vis .stats .percentage-of-total');
			let valuation = document.querySelector('.geo-vis .stats .valuation span');
			
			percent = utils.roundTenths(percent);
			
			country.textContent = region;
			percentageOfTotal.textContent = percent + '%';
			if (value !== '') {
				valuation.parentElement.style.display = 'block';
				valuation.textContent = parseInt(value).toLocaleString();
			}
			else {
				valuation.parentElement.style.display = 'none';
			}
		},
		
		setStatsLabel: function(label) {
			
			let labelElement = document.querySelector('.geo-vis .stats .label');
			labelElement.textContent = label;
		},
		
		bindUI: function() {
			
			let self = this;
			
			let mapDataButtons = document.querySelectorAll('#plasticExports,#plasticImports,#plasticMismanaged');
			
			let exportsButton = document.querySelector('#plasticExports');
			if (exportsButton) exportsButton.addEventListener('click', function() {
				mapData = exportsData;
				mismanagedDataBoolean = false;
				self.reset();
				self.showCountries();
				self.addBarGraph();
				self.setStatsLabel(exportsStatsLabel);
				barGraphTitle.html('Top 20 Global Plastic Exporters (USD)');
				
				mapDataButtons.forEach(function(button) {
					button.classList.remove('active');
				});
				exportsButton.classList.add('active');
			});
			
			let importsButton = document.querySelector('#plasticImports');
			if (importsButton) importsButton.addEventListener('click', function() {
				mapData = importsData;
				mismanagedDataBoolean = false;
				self.reset();
				
				self.showCountries();
				self.addBarGraph();
				self.setStatsLabel(importsStatsLabel);
				barGraphTitle.html('Top 20 Global Plastic Importers (USD)');
				
				mapDataButtons.forEach(function(button) {
					button.classList.remove('active');
				});
				importsButton.classList.add('active');
			});
			
			let mismanagedButton = document.querySelector('#plasticMismanaged');
			if (mismanagedButton) mismanagedButton.addEventListener('click', function() {
				mapData = mismanagedData;
				mismanagedDataBoolean = true;
				self.reset();
				
				self.showCountries();
				self.addBarGraph();
				self.setStatsLabel(mismanagedStatsLabel);
				barGraphTitle.html('Percentage of Global Mismanaged Plastic Waste, Global Top 20');
				let textWidth = barGraphTitle.node().getBBox().width;
				let textHeight = barGraphTitle.node().getBBox().height;
				barGraphTitle.attr('transform','translate(' + (barWidth/2 - (textWidth/2) - (barPadding.left/2)) + ', ' + (barGraphInnerHeight + textHeight + (barPadding.bottom/2)) + ')');
				
				mapDataButtons.forEach(function(button) {
					button.classList.remove('active');
				});
				mismanagedButton.classList.add('active');
				
				let valuation = document.querySelector('.geo-vis .stats .valuation');
				valuation.style.display = 'none';
			});
			
			let zoomIn = document.querySelector('.geo-vis .zooms .in');
			if (zoomIn) zoomIn.addEventListener('click', function() {
				map.setZoom(map.getZoom() + .75);
			});
			
			let zoomOut = document.querySelector('.geo-vis .zooms .out');
			if (zoomOut) zoomOut.addEventListener('click', function() {
				map.setZoom(map.getZoom() - .75);
			});
		},
		
		reset: function() {
			
			graph.innerHTML = '';
			countriesLayer.remove();
		}
	}
}