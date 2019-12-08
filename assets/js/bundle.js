(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  var plasticProductionData;
  var dataset;
  var circleRadius = 8;
  var count = 0;
  var circleCount = 0;
  return {
    init: function init() {
      this.myMethod();
    },
    myMethod: function myMethod() {
      d3.csv("./assets/js/data/cumulative.csv").then(function (data) {
        plasticProductionData = data;
      });
      d3.csv("./assets/js/data/circless.csv", prepare).then(function (data) {
        dataset = data;
        playButton.on("click", function () {
          var button = d3.select(this);

          if (button.text() == "Pause") {
            moving = false;
            clearInterval(timer); // timer = 0;

            button.text("Play");
          } else {
            moving = true;
            timer = setInterval(step, 150);
            button.text("Pause");
          }
        });
      });
      var monumentText = document.querySelector('.monument-visualization .label-container .monument-title');
      var totalWeightText = document.querySelector('.monument-visualization .label-container .weight'); /////////////////////////////////////////////

      var formatYear = d3.timeFormat("%Y");
      var formatDate = d3.timeFormat("%Y");
      var parseDate = d3.timeParse("%m/%Y");
      var startDate = new Date("1950"),
          endDate = new Date("2020");
      var margin = {
        top: 0,
        right: 50,
        bottom: 0,
        left: 50
      },
          width = 400 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom,
          heightslider = 130,
          widthslider = 850;
      var moving = false;
      var currentValue = 0;
      var targetValue = widthslider;
      var timer = 0;
      var playButton = d3.select("#play-button"); ////////// slider //////////

      var svgSlider = d3.select("#slider").append("svg").attr("width", widthslider + margin.left + margin.right).attr("height", heightslider);
      var scale = d3.scaleTime().domain([startDate, endDate]).range([0, targetValue]).clamp(true);
      var yScale = d3.scaleLinear().domain([2019, 1950]).range([circleRadius * 2, 390]);
      var xScale = d3.scaleLinear().domain([1950, 2019]).range([50, 1]);
      var xScale2 = d3.scaleLinear().domain([1950, 2000]).range([50, 7]);
      var slider = svgSlider.append("g").attr("class", "slider").attr("transform", "translate(" + margin.left + "," + heightslider / 2 + ")");
      slider.append("line").attr("class", "track").attr("align", "center").attr("x1", scale.range()[0]).attr("x2", scale.range()[1]).select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
      }).attr("class", "track-inset").select(function () {
        return this.parentNode.appendChild(this.cloneNode(true));
      }).attr("class", "track-overlay").call(d3.drag().on("start.interrupt", function () {
        slider.interrupt();
      }).on("start drag", function () {
        currentValue = d3.event.x;
        circleNumber.text('(x' + circleCount + ')');
        update(scale.invert(currentValue));
      }).on("end", function () {
        circleCount = 0;
      }));
      var circle1 = d3.select("#what").append("svg").attr("width", "300px").attr("height", "30px");
      var circle2 = circle1.append("circle").attr("class", "explaincircle").attr("cx", 10).attr("cy", 20).attr("r", 6).style("fill", 'orange').style("fill-opacty", "0.4");
      var circle3 = circle1.append("text").attr("class", "explaincircle").text("= 11,837,900 metric tons").attr("text-anchor", "middle").attr("font-size", "12px").attr("transform", "translate(90,24)");
      var circleNumber = circle1.append("text").attr("class", "circleNumber").attr("text-anchor", "middle").attr("font-size", "12px").attr("transform", "translate(180,25)"); // var circle3 = circle1.append("text")
      // .attr("class", "explaincircle")
      // .text(function(d) { return d.year; })
      // .attr("text-anchor", "middle")
      // .attr("font-size","12px")
      // .attr("transform", "translate(130,25)")
      // 	var gFill = d3
      // 	.select('div#slider-fill')
      // 	.append('svg')
      // 	.attr('width', widthslider)
      // 	.attr('height', heightslider)
      // 	.append('g')
      // 	.attr('transform', 'translate(30,30)');
      //   gFill.call(slider);

      slider.insert("g", ".track-overlay").attr("class", "ticks").attr("transform", "translate(0," + 18 + ")").selectAll("text").data(scale.ticks(10)).enter().append("text").attr("x", scale).attr("y", 10).attr("text-anchor", "middle").text(function (d) {
        return formatYear(d);
      }).attr("font-size", '13px');
      var handle = slider.insert("circle", ".track-overlay").attr("class", "handle").attr("r", 12).style("fill", "orange");
      var label = slider.append("text").attr("id", "label").attr("text-anchor", "middle").style("fill", "orange").text(formatDate(startDate)).attr("transform", "translate(0," + -25 + ")"); ////////// plot //////////

      var svgPlot = d3.select("#vis").append("svg").attr("width", width + margin.left + margin.right).attr("height", height);
      var plot = svgPlot.append("g").attr("class", "plot").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      function prepare(d) {
        d.id = d.id;
        d.Date = parseDate(d.Year);
        d.Year = parseDate(d.Year).getYear() + 1900;
        return d;
      }

      function step() {
        update(scale.invert(currentValue));
        currentValue = currentValue + targetValue / 120;

        if (currentValue > targetValue) {
          moving = false;
          currentValue = 0;
          clearInterval(timer); //   timer = 0;

          playButton.text("Play");
        }
      }

      function drawPlot(data) {
        var locations = plot.selectAll(".location").data(data); // if filtered dataset has more circles than already existing, transition new ones in

        locations.enter().append("circle").attr("class", "location").style("opacity", 0).attr("cx", function (d) {
          circleCount++;
          return d3.randomNormal(140, xScale(d.Year))();
        }).attr("cy", 10).style("fill", 'orange').style("stroke", 'orange').attr("r", circleRadius).transition().duration(500).attr("r", 14).style("fill", "red").transition() // .delay((d,i) => {
        // 	return i*100;
        // })
        .attr("r", 8).style("fill", 'orange').style('opacity', .4).transition().attr("cy", function (d) {
          return yScale(d.Year);
        });
        locations.exit().remove();
      }

      function update(h) {
        // update position and text of label according to slider scale
        handle.attr("cx", scale(h));
        label.attr("x", scale(h)).text(formatDate(h));
        console.log(circleCount);
        var year = 1950;
        var index = Object.keys(plasticProductionData).indexOf(year.toString());
        var production = 0;
        Object.keys(plasticProductionData).forEach(function eachKey(key) {
          year = formatYear(h);

          if (parseInt(plasticProductionData[key].Year) === parseInt(year)) {
            var plasticAmount = parseInt(plasticProductionData[key].Cumulative.toLocaleString());
            totalWeightText.textContent = parseInt(plasticProductionData[key].Cumulative).toLocaleString() + ' (MT)';
            var monumentImages = document.querySelectorAll('.monument-visualization .image-container img');
            monumentImages.forEach(function (image) {
              image.style.opacity = "0";
            });

            if (plasticAmount > 2000001 && plasticAmount < 30000000) {
              var sushiImage = document.querySelector('img.sushi');
              sushiImage.style.opacity = '1';
              monumentText.innerHTML = 'Ten-thousand Statues of Liberty';
            } else if (plasticAmount > 30000001 && plasticAmount < 60000000) {
              var eiffelImage = document.querySelector('img.eiffel');
              eiffelImage.style.opacity = '1';
              monumentText.innerHTML = '4054 Eiffel Towers';
            } else if (plasticAmount > 60000001 && plasticAmount < 300000000) {
              var gtImage = document.querySelector('img.gt');
              gtImage.style.opacity = '1';
              monumentText.innerHTML = 'Weight of Every Building on Georgia Tech\'s Campus';
            } else if (plasticAmount > 300000001 && plasticAmount < 600000000) {
              var pyramidImage = document.querySelector('img.pyramid');
              pyramidImage.style.opacity = '1';
              monumentText.innerHTML = 'All Pyramids in Egypt';
            } else if (plasticAmount > 600000001 && plasticAmount < 900000000) {
              var greatwallImage = document.querySelector('img.greatwall');
              greatwallImage.style.opacity = '1';
              monumentText.innerHTML = 'Great Wall of China';
            } else if (plasticAmount > 900000001 && plasticAmount < 1300000000) {
              var populationImage = document.querySelector('img.population');
              populationImage.style.opacity = '1';
              monumentText.innerHTML = 'Weight of World\'s Population';
            } else if (plasticAmount > 1300000001 && plasticAmount < 2100000000) {
              var skyscrapperImage = document.querySelector('img.skyscrapper');
              skyscrapperImage.style.opacity = '1';
              monumentText.innerHTML = 'Weight of All <br> Skyscrapers in the World';
            } else if (plasticAmount > 2100000001 && plasticAmount < 3000000000) {
              var roadImage = document.querySelector('img.road');
              roadImage.style.opacity = '1';
              monumentText.innerHTML = 'Weight of <br> the Entire US Road System';
            } else if (plasticAmount > 3000000001 && plasticAmount < 5100000000) {
              var icebergImage = document.querySelector('img.iceberg');
              icebergImage.style.opacity = '1';
              monumentText.innerHTML = 'Weight of All <br> Icebergs in Antartica';
            } else if (plasticAmount > 5100000001 && plasticAmount < 7500000000) {
              var carImage = document.querySelector('img.car');
              carImage.style.opacity = '1';
              monumentText.innerHTML = 'Total Weight of <br> Every Car on Planet Earth';
            } else if (plasticAmount > 7500000001 && plasticAmount < 10000000001) {
              var cometImage = document.querySelector('img.comet');
              cometImage.style.opacity = '1';
              monumentText.innerHTML = 'Chicxulub Asteroid <br> (caused extinction of dinosaurs)';
            }
          }

          ;
        }); //filter data set and redraw plot

        var newData = dataset.filter(function (d, i) {
          return d.Date < h;
        });
        drawPlot(newData);
      }
    }
  };
};

},{}],2:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {
      graphicHeight: 400
    },
    init: function init() {
      this.addBarGraph();
    },
    addBarGraph: function addBarGraph() {
      var self = this;
      var data = [{
        'river': 'Yangtze',
        'countries': ['China'],
        'amount': 3.33e5
      }, {
        'river': 'Ganges',
        'countries': ['India', 'Bangladesh'],
        'amount': 1.15e5
      }, {
        'river': 'Xi',
        'countries': ['China'],
        'amount': 7.39e4
      }, {
        'river': 'Huangpu',
        'countries': ['China'],
        'amount': 4.08e4
      }, {
        'river': 'Cross',
        'countries': ['Nigeria', 'Cameroon'],
        'amount': 4.03e4
      }, {
        'river': 'Brantas',
        'countries': ['Indonesia'],
        'amount': 3.89e4
      }, {
        'river': 'Amazon',
        'countries': ['Brazil', 'Peru', 'Columbia', 'Ecuador'],
        'amount': 3.89e4
      }, {
        'river': 'Pasig',
        'countries': ['Philippines'],
        'amount': 3.88e4
      }, {
        'river': 'Irrawaddy',
        'countries': ['Myanmar'],
        'amount': 3.53e4
      }, {
        'river': 'Solo',
        'countries': ['Indonesia'],
        'amount': 3.25e4
      }, {
        'river': 'Mekong',
        'countries': ['Thailand', 'Cambodia', 'Laos', 'China', 'Myanmar', 'Vietnam'],
        'amount': 2.28e4
      }, {
        'river': 'Imo',
        'countries': ['Nigeria'],
        'amount': 2.15e4
      }, {
        'river': 'Dong',
        'countries': ['China'],
        'amount': 1.91e4
      }, {
        'river': 'Serayu',
        'countries': ['Indonesia'],
        'amount': 1.71e4
      }, {
        'river': 'Magdalena',
        'countries': ['Colombia'],
        'amount': 1.67e4
      }, {
        'river': 'Tamsui',
        'countries': ['Taiwan'],
        'amount': 1.47e4
      }, {
        'river': 'Zhujiang',
        'countries': ['China'],
        'amount': 1.36e4
      }, {
        'river': 'Hanjiang',
        'countries': ['China'],
        'amount': 1.29e4
      }, {
        'river': 'Progo',
        'countries': ['Indonesia'],
        'amount': 1.28e4
      }, {
        'river': 'Kwa Ibo',
        'countries': ['Nigeria'],
        'amount': 1.19e4
      }];
      var graphs = document.querySelectorAll('.horizontal-bar');
      graphs.forEach(function (graph) {
        var graphicContainer = graph.parentElement;
        var padding = {
          top: 60,
          right: 40,
          bottom: 80,
          left: 100
        };
        var width = graphicContainer.offsetWidth - padding.left - padding.right;
        var height = self.settings.graphicHeight - padding.top - padding.bottom;
        var barHeight = 5;
        var y = d3.scaleBand().range([height, 0]);
        var x = d3.scaleLinear().range([0, width]);
        var svg = d3.select(graph).append('svg').attr('width', width + padding.left + padding.right).attr('height', height + padding.top + padding.bottom).append('g').attr('transform', 'translate(' + padding.left + ',' + padding.top + ')'); // format the data

        data.forEach(function (d) {
          d.amount = +d.amount;
        });

        var compare = function compare(a, b) {
          return b.amount - a.amount;
        };

        data = data.sort(compare);
        var maxValue = d3.max(data, function (d) {
          return d.amount;
        }); // Scale the range of the data in the domains

        x.domain([0, maxValue + maxValue * .02]);
        y.domain(data.map(function (d) {
          return d.river;
        }));
        svg.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('width', function (d) {
          return x(d.amount);
        }).attr('y', function (d) {
          return y(d.river) + (y.bandwidth() / 2 - barHeight / 2);
        }).attr('height', barHeight);
        svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
        svg.append('g').call(d3.axisLeft(y).tickSize(0)); // Add graph title

        var title = svg.append('text').attr('class', 'title').text('Top 20 Global Rivers Ranked by Ocean Plastic Input');
        var textWidth = title.node().getBBox().width;
        var textHeight = title.node().getBBox().height;
        title.attr('transform', 'translate(' + (width / 2 - textWidth / 2 - padding.left / 2) + ', ' + (-1 * (padding.top / 2) + 10) + ')');
        var xAxisHeight = 20;
        var xAxisLabel = svg.append('text').attr('class', 'x-axis-label').html('Mass of Plastic Input in Tons Per Year');
        textWidth = xAxisLabel.node().getBBox().width;
        textHeight = xAxisLabel.node().getBBox().height;
        xAxisLabel.attr('transform', 'translate(' + (width / 2 - textWidth / 2 - padding.left / 2) + ', ' + (height + xAxisHeight + padding.bottom / 2) + ')'); // let yAxisLabel = svg.append('text') 
        // 	.attr('class', 'y-axis-label')
        // 	.text('y-axis label here');
        // textWidth = yAxisLabel.node().getBBox().width;
        // textHeight = yAxisLabel.node().getBBox().height;
        // yAxisLabel.attr('transform','translate(' + (-1 * padding.left + textHeight * 2.5) + ', ' + (height/2 + (textWidth/2)) + ') rotate(-90)');
      });
    }
  };
};

},{}],3:[function(require,module,exports){
"use strict";

require('leaflet-arc');

module.exports = function () {
  var selectColor = '#E66200';
  var defaultColor = '#E6965B';
  var exportsStatsLabel = 'total global plastic exports',
      importsStatsLabel = 'total global plastic imports',
      mismanagedStatsLabel = 'of all waste mismanaged';
  var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
  var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
  var mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png?access_token={accessToken}';
  var mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}';
  var graph, countriesLayer, barGraphTitle, worldTotal;

  var mapData, exportsData, importsData, mismanagedData, geojson, _toolTip, barData, barWidth, barPadding, barGraphInnerHeight, mismanagedDataBoolean;

  var china = {
    location: new L.LatLng(23.638, 120.998),
    zoom: 3
  };
  var center = {
    location: new L.LatLng(30, 20),
    zoom: 2.5
  };
  var mismanagedCenter = {
    location: new L.LatLng(10, 70),
    zoom: 3.5
  };
  var setLocation = center;

  var _map = L.map('map', {
    zoomControl: false,
    zoomSnap: 0.01
  }).setView(setLocation.location, setLocation.zoom);

  var svg = d3.select('#map').select('svg');
  var pointsGroup = svg.select('g').attr('class', 'points').append('g');
  var northwestCorner = L.latLng(120, -171);
  var southeastCorner = L.latLng(-40, 175);
  var bounds = L.latLngBounds(northwestCorner, southeastCorner);

  _map.setZoom(_map.getBoundsZoom(bounds));

  var svgLayer = L.svg();
  svgLayer.addTo(_map);
  return {
    init: function init() {
      var self = this;
      self.map();
      self.exports();
      self.bindUI(); //self.toolTip();
    },
    toolTip: function toolTip() {
      _toolTip = d3.tip().attr("class", "d3-tip").offset([-12, 0]).html(function (d) {
        return '<div class="tooltip"><h5>' + d['name'] + "</h5></div>";
      });
      svg.call(_toolTip);
    },
    setScrollPoints: function setScrollPoints() {
      var self = this;
      var veil = document.querySelector('.veil');
      var waypoint = new Waypoint({
        element: document.getElementById('showAsia'),
        handler: function handler(direction) {
          if (direction === 'down') {} else {}
        },
        offset: 0
      });
    },
    exports: function exports() {
      var self = this;
      d3.csv('./assets/js/data/imports.csv', prepareImports).then(function (data) {
        importsData = data;
      });

      function prepareImports(d) {
        var row = [];
        row.amount = d['2017'];

        if (d['Partner Name'] === 'World') {
          worldTotal = row.amount;
        }

        if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === 'World') {
          row.region = d['Partner Name'];
        } else {
          row.country = d['Partner Name'];
        }

        if (row.amount !== '' && row.country) return row;
      }

      d3.csv('./assets/js/data/mismanaged.csv', prepareMismanaged).then(function (data) {
        mismanagedData = data;
      });

      function prepareMismanaged(d) {
        var row = [];
        row.amount = d['Share of plastic inadequately managed (%)'];
        row.country = d['Entity'];
        if (row.amount !== '' && row.country) return row;
      }

      d3.json('./assets/js/data/ne_10m_admin_0_countries.json').then(function (json) {
        geojson = json;
        d3.csv('./assets/js/data/exports.csv', prepareExports).then(function (data) {
          exportsData = data;
          mapData = exportsData; //console.log(exportsData);

          self.showCountries();
          self.addBarGraph();
        });

        function prepareExports(d) {
          var row = [];
          row.amount = d['2017'];

          if (d['Partner Name'] === 'World') {
            worldTotal = row.amount;
          }

          if (d['Partner Name'] === 'Europe & Central Asia' || d['Partner Name'] === 'East Asia & Pacific' || d['Partner Name'] === 'North America' || d['Partner Name'] === 'Latin America & Caribbean' || d['Partner Name'] === 'Middle East & North Africa' || d['Partner Name'] === 'South Asia' || d['Partner Name'] === 'Sub-Saharan Africa' || d['Partner Name'] === 'Australia' || d['Partner Name'] === 'World') {
            row.region = d['Partner Name'];
          } else {
            row.country = d['Partner Name'];
          }

          if (row.amount !== '' && row.country) return row;
        }
      });
    },
    map: function map() {
      var self = this;
      var mapElement = d3.select('.fullscreen-map');
      var mapWidth = parseInt(mapElement.offsetWidth);
      var mapHeight = parseInt(mapElement.offsetHeight);
      var vertices = d3.map();
      var activeMapType = 'nodes_links';
      L.tileLayer(mapWithoutLabels, {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
        edgeBufferTiles: 2,
        reuseTiles: true,
        format: 'jpg70',
        noWrap: true
      }).addTo(_map);

      _map.doubleClickZoom.disable();

      _map.scrollWheelZoom.disable();
    },
    showLabels: function showLabels() {
      L.tileLayer(mapWithLabels, {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
        edgeBufferTiles: 2
      }).addTo(_map);
    },
    hideLabels: function hideLabels() {
      L.tileLayer(mapWithoutLabels, {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
        edgeBufferTiles: 2
      }).addTo(_map);
    },
    showCountries: function showCountries() {
      var self = this;

      var sortAmountDesc = function sortAmountDesc(a, b) {
        return b.amount - a.amount;
      };

      mapData = mapData.sort(sortAmountDesc).slice(0, 20);
      barData = mapData.sort(sortAmountDesc).slice(0, 20);
      var min = mapData[19].amount;
      var max = mapData[0].amount;

      function styleFeature(feature) {
        var result;
        mapData.forEach(function (row) {
          if (feature.properties.NAME === row.country) {
            //console.log(row.amount / 100)
            result = {
              fillColor: '#E66200',
              weight: .25,
              opacity: 1,
              // stroke opacity
              color: 'black',
              fillOpacity: row.amount / max * .4 + .3 //fillOpacity: row.amount / 100

            };
          }
        });
        if (result) return result;
        return {
          // for countries not selected otherwise will show the default fill
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
      countriesLayer.addTo(_map);
    },
    eachGeoFeature: function eachGeoFeature(feature, layer) {
      var popup;
      layer.on({
        mouseover: function mouseover(d) {
          var countryName = d.target.feature.properties.NAME_EN;
          var countryExports = '';
          var countryImports = '';
          var countryMismanaged = '';
          var hoveredCountryExports = exportsData.filter(function (row) {
            console.log(row.country === countryName, row.country, countryName);
            if (row.country === countryName) return row;
          });
          var hoveredCountryImports = importsData.filter(function (row) {
            if (row.country === countryName) return row;
          });
          var hoveredCountryMismanaged = mismanagedData.filter(function (row) {
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

          var markup = '<div class="popup-custom">';
          markup += '<h4 class="country">' + countryName + '</h4>';
          markup += '<div class="exports"><strong>Total exports (USD):</strong> $' + countryExports + '</div>';
          markup += '<div class="imports"><strong>Total imports (USD):</strong> $' + countryImports + '</div>';
          markup += '<div class="mismanaged"><strong>Percentage mismanaged waste:</strong> ' + countryMismanaged + '%</div>';
          markup += '</div>';
          popup = L.popup({
            minWidth: 500
          }, countriesLayer).setLatLng(d.latlng).setContent(markup).openOn(_map);
        },
        mouseout: function mouseout(d) {
          if (popup && !d.originalEvent.toElement.classList.contains('leaflet-popup-content-wrapper')) {
            // don't hide when moving mouse into the popup
            popup.remove();
          }
        },
        click: function click() {}
      });
    },
    addBarGraph: function addBarGraph() {
      var self = this;
      graph = document.querySelector('.geo-vis .bar-graph');
      var graphicContainer = graph.parentElement;
      barPadding = {
        top: 60,
        right: 100,
        bottom: 80,
        left: 200
      };
      var barGraphHeight = 425;
      var barHeight = 7;
      barWidth = graphicContainer.offsetWidth - barPadding.left - barPadding.right;
      barGraphInnerHeight = barGraphHeight - barPadding.top - barPadding.bottom;
      var maxValue = d3.max(mapData, function (d) {
        return d.amount;
      });

      var compare = function compare(a, b) {
        // sort vertical direction of bars
        return a.amount - b.amount;
      };

      mapData = mapData.sort(compare);
      var top = mapData.slice(0)[19];
      var worldPercent;

      if (mismanagedDataBoolean) {
        worldPercent = top.amount;
      } else {
        worldPercent = Math.round(10 * worldTotal / top.amount) / 10;
      }

      self.updateStats(worldPercent, top.country, top.amount);
      var count = 21;
      var y = d3.scaleBand().domain(mapData.map(function (d) {
        return d.country;
      })).range([barGraphInnerHeight, 0]);
      var x = d3.scaleLinear().domain([0, maxValue]).range([0, barWidth - 100]);
      var svg = d3.select(graph).append('svg').attr('width', barWidth + barPadding.left + barPadding.right).attr('height', barGraphInnerHeight + barPadding.top + barPadding.bottom).append('g').attr('transform', 'translate(' + barPadding.left + ',' + barPadding.top + ')');
      svg.selectAll('.bar').data(mapData).enter() // .append('rect').attr('height', barHeight).attr('barWidth', function(d) { // make clear hover interaction
      // 	return x(d.amount);
      // }).style('fill', 'red').attr('y', function (d) {
      // 	return y(d.country) + (y.bandwidth());
      // })
      .append('rect').on('mouseover', function (d) {
        d3.event.target.style.fill = selectColor;
        var percentage = (parseInt(d.amount) / parseInt(worldTotal) * 100).toFixed(1);
        if (percentage.toString().slice(-2) === '.0') percentage = parseInt(percentage).toFixed(0);
        if (mismanagedDataBoolean) self.updateStats(d.amount, d.country, '');else {
          self.updateStats(percentage, d.country, d.amount); // why is percent wrong?
        }
      }).on('mouseout', function () {
        d3.event.target.style.fill = defaultColor;
      }).on('click', function (d) {}).attr('class', 'bar').attr('y', function (d) {
        return y(d.country) + (y.bandwidth() / 2 - barHeight / 2);
      }).attr('height', barHeight).attr('width', 0).transition().delay(function (d, i) {
        return i * 40;
      }).ease(d3.easeCubicOut).duration(300).attr('width', function (d) {
        return x(d.amount);
      });
      svg.append('g').attr('transform', 'translate(0,' + (barGraphInnerHeight + 6) + ')').call(d3.axisBottom(x));
      svg.append('g').call(d3.axisLeft(y).tickSize(0));
      var titleHeight = 20;
      barGraphTitle = svg.append('text').attr('class', 'x-axis-label').html('Top 20 Global Plastic Exporters (USD)');
      var textWidth = barGraphTitle.node().getBBox().width;
      var textHeight = barGraphTitle.node().getBBox().height;
      barGraphTitle.attr('transform', 'translate(' + (barWidth / 2 - textWidth / 2 - barPadding.left / 2) + ', ' + (barGraphInnerHeight + titleHeight + barPadding.bottom / 2) + ')');
    },
    updateStats: function updateStats(percent, region, value) {
      var country = document.querySelector('.geo-vis .stats .country');
      var percentageOfTotal = document.querySelector('.geo-vis .stats .percentage-of-total');
      var valuation = document.querySelector('.geo-vis .stats .valuation span');
      country.textContent = region;
      percentageOfTotal.textContent = percent + '%';

      if (value !== '') {
        valuation.parentElement.style.display = 'block';
        valuation.textContent = parseInt(value).toLocaleString();
      } else {
        valuation.parentElement.style.display = 'none';
      }
    },
    setStatsLabel: function setStatsLabel(label) {
      var labelElement = document.querySelector('.geo-vis .stats .label');
      labelElement.textContent = label;
    },
    bindUI: function bindUI() {
      var self = this;
      var mapDataButtons = document.querySelectorAll('#plasticExports,#plasticImports,#plasticMismanaged');
      var exportsButton = document.querySelector('#plasticExports');
      if (exportsButton) exportsButton.addEventListener('click', function () {
        mapData = exportsData;
        mismanagedDataBoolean = false;
        self.reset();
        self.showCountries();
        self.addBarGraph();
        self.setStatsLabel(exportsStatsLabel);
        barGraphTitle.html('Top 20 Global Plastic Exporters (USD)');
        mapDataButtons.forEach(function (button) {
          button.classList.remove('active');
        });
        exportsButton.classList.add('active');
        setTimeout(function () {
          _map.flyTo(center.location, center.zoom);
        }, 1000);
      });
      var importsButton = document.querySelector('#plasticImports');
      if (importsButton) importsButton.addEventListener('click', function () {
        mapData = importsData;
        mismanagedDataBoolean = false;
        self.reset();
        self.showCountries();
        self.addBarGraph();
        self.setStatsLabel(importsStatsLabel);
        barGraphTitle.html('Top 20 Global Plastic Importers (USD)');
        mapDataButtons.forEach(function (button) {
          button.classList.remove('active');
        });
        importsButton.classList.add('active');
        setTimeout(function () {
          _map.flyTo(center.location, center.zoom);
        }, 1000);
      });
      var mismanagedButton = document.querySelector('#plasticMismanaged');
      if (mismanagedButton) mismanagedButton.addEventListener('click', function () {
        mapData = mismanagedData;
        mismanagedDataBoolean = true;
        self.reset();
        self.showCountries();
        self.addBarGraph();
        self.setStatsLabel(mismanagedStatsLabel);
        barGraphTitle.html('Percentage of Country\'s Plastic Waste that is Mismanaged, Global Top 20');
        var textWidth = barGraphTitle.node().getBBox().width;
        var textHeight = barGraphTitle.node().getBBox().height;
        barGraphTitle.attr('transform', 'translate(' + (barWidth / 2 - textWidth / 2 - barPadding.left / 2) + ', ' + (barGraphInnerHeight + textHeight + barPadding.bottom / 2) + ')');
        mapDataButtons.forEach(function (button) {
          button.classList.remove('active');
        });
        mismanagedButton.classList.add('active');
        var valuation = document.querySelector('.geo-vis .stats .valuation');
        valuation.style.display = 'none';
        setTimeout(function () {
          _map.flyTo(mismanagedCenter.location, mismanagedCenter.zoom);
        }, 1000);
      });
      var zoomIn = document.querySelector('.geo-vis .zooms .in');
      if (zoomIn) zoomIn.addEventListener('click', function () {
        _map.setZoom(_map.getZoom() + .75);
      });
      var zoomOut = document.querySelector('.geo-vis .zooms .out');
      if (zoomOut) zoomOut.addEventListener('click', function () {
        _map.setZoom(_map.getZoom() - .75);
      });
    },
    reset: function reset() {
      graph.innerHTML = '';
      countriesLayer.remove();
    }
  };
};

},{"leaflet-arc":10}],4:[function(require,module,exports){
"use strict";

module.exports = function () {
  var clearButton;
  return {
    dimensions: null,
    settings: {},
    init: function init() {
      this.parallelCoordinates();
    },
    parallelCoordinates: function parallelCoordinates() {
      // GLOBALS
      var DATA_URL = './assets/js/data/aggregated.csv';
      var DATA = {}; // END GLOBALS
      // LOAD DATA

      function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }

      var parentElement = document.querySelector('.paracoords');
      var svgWidth = parentElement.offsetWidth * .60,
          // setting width to 60% of parent container for responsiveness. Adjust if necessary.
      svgHeight = window.innerHeight * .60,
          margin = {
        top: 30,
        right: 100,
        bottom: 30,
        left: 100
      },
          width = svgWidth - margin.left - margin.right,
          height = svgHeight - margin.top - margin.bottom;
      var x,
          y = {},
          dimensions,
          dragging = {},
          sliders;
      var foreground_enter, foreground_group, background_enter, background_group, country_container_enter, country_container_group;
      var selected = [];
      var country_container_element;
      var div_selector = 'div.paracoords';
      var svg = d3.select(div_selector).append("svg").attr('id', 'paracoords-svg').attr("width", svgWidth).attr("height", svgHeight).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var foreground = svg.append('g').attr('class', 'foreground');
      var background = background_group = svg.append('g').attr('class', 'background'); // var country_selector = d3.select('body').append('input')
      //     .attr('type', 'text')
      //     .attr('class', 'country-selector')
      //     .attr('placeholder', 'Country')
      //     .attr('value', '');

      var selectors = d3.select(div_selector).append('div').attr('id', 'selectors');
      selectors.append('h2').text('Select Countries');
      var country_container = selectors.append('select').attr('class', 'country-container').attr('multiple', 'true').attr('size', 10);
      var clearButton = selectors.append('div').attr('class', 'button-container').append('button').attr('class', 'clear-all-countries').text('Clear All');
      var function_keys = {
        fish_consumption: 0.5,
        coastal_population: 0.5,
        gdp: 0.5
      };
      var tooltip_div = d3.select(div_selector).append('div').attr('class', 'tooltip').style('opacity', 0);
      d3.csv(DATA_URL).then(function (data) {
        var scales = {
          total_population: d3.scaleLinear().domain([0, d3.max(data, function (d) {
            return d.total_population;
          })]).range([0, 1]),
          coastal_population: d3.scaleLinear().domain([0, d3.max(data, function (d) {
            return d.coastal_population;
          })]).range([0, 1]),
          plastic_waste_per_capita: d3.scaleLinear().domain([0, d3.max(data, function (d) {
            return d.plastic_waste_per_capita;
          })]).range([0, 1]),
          plastic_waste_total: d3.scaleLinear().domain([0, d3.max(data, function (d) {
            return d.plastic_waste_total;
          })]).range([0, 1]),
          fish_consumption: d3.scaleLinear().domain([0, d3.max(data, function (d) {
            return d.fish_consumption;
          })]).range([0, 1]),
          gdp: d3.scaleLinear().domain([0, d3.max(data, function (d) {
            return d.gdp;
          })]).range([0, 1])
        }; // var data = []

        data.forEach(function (d, i) {
          d.code = d.code;
          d.country = d.country;
          d.total_population = scales.total_population(+d.total_population);
          d.coastal_population = scales.coastal_population(+d.coastal_population);
          d.plastic_waste_per_capita = scales.plastic_waste_per_capita(+d.plastic_waste_per_capita);
          d.plastic_waste_total = scales.plastic_waste_total(+d.plastic_waste_total);
          d.fish_consumption = scales.fish_consumption(+d.fish_consumption);
          d.gdp = scales.gdp(+d.gdp);
        });
        data = calcImpactMetric(data);
        data = calcRankings(data);
        data.sort(function (a, b) {
          return d3.ascending(a.country, b.country);
        });
        drawCountries('', data);
        clearButton.on('click', function () {
          document.querySelector('.country-container').querySelectorAll('option').forEach(function (option) {
            option.selected = false;
          });
          var storedScrollLocation = country_container_element.scrollTop;
          selected = [];
          draw(data);
          setTimeout(function () {
            country_container_element.scrollTop = storedScrollLocation;
          }, 0);
        });
        dimensions = d3.keys(data[0]).filter(function (key) {
          if (key == 'pollute_rank') {
            y[key] = d3.scaleLinear().domain(d3.extent(data, function (d) {
              return +d[key];
            }).reverse()).range([height, 0]);
            return key;
          } else if (key == 'impact_rank') {
            y[key] = d3.scaleLinear().domain(d3.extent(data, function (d) {
              return +d[key];
            }).reverse()).range([height, 0]);
            return key;
          } // } else if (key == 'inadequately_managed_plastic_rank') {
          //     y[key] = d3.scaleLinear()
          //         .domain(d3.extent(data, function(d) {
          //             return +d[key];
          //         }).reverse())
          //         .range([0, height]);
          //     return key;
          // }

        });
        x = d3.scalePoint().domain(dimensions).range([0, width]);
        draw(data);
        selectors.append('h2').text('Adjust Ranking');
        var table = selectors.append('table').attr('class', 'slider-table');
        Object.keys(function_keys).forEach(function (d) {
          var tr = table.append('tr');
          var span_td = tr.append('td');
          span_td.append('span').text(function () {
            if (d == 'coastal_population') return 'Coastal Population: ';else if (d == 'gdp') return 'Gross Domestic Product: ';else if (d == 'fish_consumption') return 'Fish Consumption: ';else return 'null';
          });
          var slider_td = tr.append('td');
          var slider = slider_td.append('input').attr('type', 'range').attr('min', '0').attr('max', '100').property('value', '50');
          slider.on('input', function () {
            function_keys[d] = slider.property('value') / 100;
            data = calcImpactMetric(data);
            data = calcRankings(data);
            draw(data);
          });
        });
        var legend = selectors.append('div').attr('class', 'legend');
        legend.append('div').attr('class', 'colorscale-gradient');
        var legendScale = document.querySelector('.legend-scale');
        if (legendScale) legend.node().append(legendScale);
        var g = svg.selectAll(".dimension").data(dimensions).enter().append("g").attr("class", "dimension").attr("transform", function (d) {
          return "translate(" + x(d) + ")";
        }).call(d3.drag().on("start", function (d) {
          dragging[d] = x(d);
          background_group.attr("visibility", "hidden");
        }).on("drag", function (d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground_group.attr("d", line);
          dimensions.sort(function (a, b) {
            return position(a) - position(b);
          });
          x.domain(dimensions);
          g.attr("transform", function (d) {
            return "translate(" + position(d) + ")";
          });
        }).on("end", function (d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground_group).attr("d", line);
          background_group.attr("d", line).transition().delay(500).duration(0).attr("visibility", null);
        }));
        g.append("g").attr("class", "axis").each(function (d) {
          if (d == 'pollute_rank') d3.select(this).call(d3.axisLeft().scale(y[d]));else if (d == 'impact_rank') d3.select(this).call(d3.axisRight().scale(y[d]));
        }).append("text").style("text-anchor", "middle").attr("fill", "white").attr("font-size", "12").attr("y", -9).text(function (d) {
          if (d == 'pollute_rank') return "Contribution (rank)";else if (d == 'inadequately_managed_plastic_rank') return "Inadequately Managed Plastic (Rank)";else return "Impact (rank)";
        });
        g.append("g").attr("class", "brush").each(function (d) {
          var _this = this;

          d3.select(this).call(y[d].brush = d3.brushY().extent([[-10, 0], [10, height]]).on("start", brushstart).on("brush", brush).on("end", brush)).on('click', function () {
            d3.select(_this).call(y[d].brush.move, null);
          });
        }).selectAll("rect").attr("x", -8).attr("width", 16);
      });

      function drawCountries(filt, data) {
        country_container_group = country_container.selectAll('option').data(data, function (d) {
          return d.code;
        });
        country_container_group.exit().remove();
        country_container_enter = country_container_group.enter().append('option').attr('style', function (d) {
          return 'background-image: url(./assets/img/countries/' + d.country + '.svg)';
        });
        country_container_group = country_container_group.merge(country_container_enter).attr('class', 'country').attr('id', function (d) {
          return d.code;
        }).html(function (d) {
          return '<img src="./assets/img/countries/' + d.country + '.svg"></img><span>' + toTitleCase(d.country.replace(new RegExp('-', 'gi'), ' ')) + '</span>';
        }).on('mousedown', function (d) {
          d3.event.preventDefault();
          country_container_element = document.querySelector('.country-container');
          var storedScrollLocation = country_container_element.scrollTop;

          if (selected.indexOf(d.code) >= 0) {
            for (var i = 0; i < selected.length; i++) {
              if (selected[i] == d.code) selected.splice(i, 1);
            }

            document.getElementById(d.code).selected = false;
          } else {
            selected.push(d.code);
            document.getElementById(d.code).selected = true;
          }

          setTimeout(function () {
            country_container_element.scrollTop = storedScrollLocation;
          }, 0);
          draw(data);
        });
      }

      function draw(data) {
        // draw the background, make sure it merges so that when the
        // data gets updated nothing fucky happens
        // y['impact_rank'] = d3.scaleLinear()
        //     .domain(d3.extent(data, function(d) {
        //         return impact(d);
        //     }).reverse())
        //     .range([height, 0]);
        // draw the forerground, do the same thing. Note that tooltips
        // are also included here. 
        var color = d3.scaleLinear().domain(d3.extent(data, function (d) {
          return d.inadequately_managed_plastic;
        })).range([0, 1]);
        var filtered_data = data.filter(function (d) {
          return selected.indexOf(d.code) >= 0;
        });
        foreground_group = foreground.selectAll('path').data(filtered_data, function (d) {
          return d.code;
        });
        foreground_group.exit().remove();
        foreground_enter = foreground_group.enter().append('path').on('mouseover', tooltip).on('mouseout', function () {
          tooltip_div.style('opacity', 0);
        }).attr('stroke', function (d) {
          return d3.interpolateRgb('red', 'rgb(0, 176, 255)')(color(d.inadequately_managed_plastic));
        });
        foreground_group = foreground_group.merge(foreground_enter).attr('d', line).style('stroke-width', 3).style('opacity', function (d) {
          return selected.indexOf(d.code) >= 0 ? 1 : 0;
        });
        background_group = background.selectAll('path').data(filtered_data, function (d) {
          return d.code;
        });
        background_group.exit().remove();
        background_enter = background_group.enter().append('path');
        background_group = background_group.merge(background_enter).attr('d', line).style('display', function (d) {
          return selected.indexOf(d.code) >= 0 ? 1 : 0;
        });
      }

      function tooltip(d) {
        // tooltip_div is declared as a global variable
        // at the top of the file. For convenience,

        /*
        tooltip_div = d3.select('body')
        	.append('div')
        	.attr('class', 'tooltip')
        	.style('opacity', 0);
        */
        tooltip_div.style('opacity', 0.9);
        tooltip_div.html('<b class="title">' + toTitleCase(d.country.replace(new RegExp('-', 'gi'), ' ')) + '</b><br/>Pollution Rank: ' + d.pollute_rank + '<br/>Impact Rank: ' + d.impact_rank).style('left', d3.event.pageX + 10 + 'px').style('top', d3.event.pageY - 28 + 'px');
      }

      function calcRankings(data) {
        var rankings = [];
        data.sort(function (a, b) {
          return d3.descending(a.plastic_waste_total, b.plastic_waste_total);
        }).forEach(function (d, i) {
          d.pollute_rank = i + 1;
        });
        data.sort(function (a, b) {
          return d3.descending(a.impact, b.impact);
        }).forEach(function (d, i) {
          d.impact_rank = i + 1;
        });
        data.sort(function (a, b) {
          return d3.descending(a.inadequately_managed_plastic, b.inadequately_managed_plastic);
        }).forEach(function (d, i) {
          d.inadequately_managed_plastic_rank = i + 1;
        });
        return data;
      }

      function calcImpactMetric(data) {
        data.forEach(function (d) {
          d.impact = function_keys.coastal_population * (d.coastal_population / d.total_population) + function_keys.fish_consumption * d.fish_consumption - function_keys.gdp * d.gdp;
        });
        return data;
      }

      function line(d) {
        return d3.line()(dimensions.map(function (key) {
          if (key == 'impact_rank') {
            return [x(key), y[key](d[key])];
          } else {
            return [x(key), y[key](d[key])];
          }
        }));
      }

      function brushstart() {
        d3.event.sourceEvent.stopPropagation();
      } // Handles a brush event, toggling the display of foreground lines.


      function brush() {
        // Get a set of dimensions with active brushes and their current extent.
        var actives = [];
        svg.selectAll(".brush").filter(function (d) {
          return d3.brushSelection(this);
        }).each(function (key) {
          actives.push({
            dimension: key,
            extent: d3.brushSelection(this)
          });
        }); // Change line visibility based on brush extent.

        if (actives.length === 0) {
          foreground_group.style("display", null);
        } else {
          foreground_group.style("display", function (d) {
            return actives.every(function (brushObj) {
              return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension]) && y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1];
            }) ? null : "none";
          });
        }
      }

      function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
      }

      function transition(g) {
        return g.transition().duration(500);
      }

      function impact(d) {
        return -1 * (function_keys.coastal_population * (d.coastal_population / d.total_population)) - function_keys.fish_consumption * d.fish_consumption + function_keys.gdp * d.gdp;
      }
    }
  };
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function () {
  var graphic = document.querySelector('.plastic-longevity .graphic');
  var data = [{
    'years': 450
  }];
  var width;
  if (graphic) width = parseInt(graphic.offsetWidth);
  var height = 500;
  var svg;
  var cupWidth, cupHeight;
  var timescaleHeight = 140;
  var canvas = document.querySelector('#dotCanvas');
  var canvasHolder = document.querySelector('.plastic-longevity .canvas-holder');
  var draggerTransform = 0;
  var previousDraggerTransform = 0;
  var totalCount = 0;
  var unitVisContainer = document.querySelector('.plastic-longevity .unit-vis-viewport');
  var message = document.querySelector('.plastic-longevity .message');
  var countElement = document.querySelector('.use-ratio .count');
  var generationLength = 76;
  var center = {
    x: width / 2,
    y: height / 2
  };
  var settings = {
    materials: {
      bottle: {
        title: '1 Plastic Bottle',
        path: './assets/svg/bottle.svg',
        useTimeHours: 1,
        useTimeDisplay: '1 hour',
        mass: '24g',
        breakdownTime: 450,
        breakdownTimeDisplay: '450 years'
      },
      coffee: {
        title: '1 Plastic Coffee Lid',
        path: './assets/svg/coffee.svg',
        useTimeHours: 2,
        useTimeDisplay: '2 hours',
        mass: '4.48g',
        breakdownTime: 425,
        breakdownTimeDisplay: '425 years'
      },
      vegetable: {
        title: 'Vegetable',
        path: './assets/svg/vegetable.svg',
        useTimeHours: 2,
        useTimeDisplay: '2 hours',
        mass: '',
        breakdownTime: .246575,
        breakdownTimeDisplay: '3 months'
      },
      cardboard: {
        title: 'Cardboard',
        path: './assets/img/cardboard.png',
        useTimeHours: 72,
        useTimeDisplay: '3 days',
        mass: 'Variable',
        breakdownTime: .249315,
        breakdownTimeDisplay: '3 months'
      }
    }
  };
  return {
    init: function init() {
      this.useRatio(settings.materials['bottle'].useTimeHours, settings.materials['bottle'].breakdownTime);
      this.longevityTimescale();
      this.bindUI();
      this.miniMap();
      this.setMaterial('bottle');
    },
    longevityTimescale: function longevityTimescale() {
      var self = this;
      var ratio, remainder;
      var glyph = document.querySelector('.generation-glyphs .frame');
      var graph = document.querySelector('.longevity');
      var graphicContainer = graph.parentElement;
      var padding = {
        top: 5,
        right: 50,
        bottom: 80,
        left: 20
      };
      var width = graphicContainer.offsetWidth - padding.left - padding.right;
      var height = timescaleHeight - padding.top - padding.bottom;
      var barHeight = 15;
      var barWidth = 0;
      var y = d3.scaleBand().range([height, 0]);
      var x = d3.scaleLinear().range([0, width]);
      var svg = d3.select(graph).append('svg').attr('width', width + padding.left + padding.right).attr('height', height + padding.top + padding.bottom).append('g').attr('transform', 'translate(' + padding.left + ',' + padding.top + ')'); // format the data

      data.forEach(function (d) {
        d.years = +d.years;
      });

      var compare = function compare(a, b) {
        return b.years - a.years;
      };

      data = data.sort(compare);
      var maxValue = d3.max(data, function (d) {
        return d.years;
      }); // Scale the range of the data in the domains

      x.domain([0, maxValue + maxValue * .2]);
      var xAxisHeight = 20;
      var xAxisLabel = svg.append('text').attr('class', 'x-axis-label').html('Years to Break Down');
      var textWidth = xAxisLabel.node().getBBox().width;
      var textHeight = xAxisLabel.node().getBBox().height;
      xAxisLabel.attr('transform', 'translate(' + (width / 2 - textWidth) + ', ' + (height + xAxisHeight + padding.bottom / 2) + ')');
      svg.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('width', function (d) {
        barWidth = x(d.years);
        ratio = d.years / generationLength;
        remainder = x(d.years % generationLength);
        return x(d.years);
      }).attr('height', barHeight);
      var generations = document.querySelector('.generation-glyphs');

      for (var i = 0; i < Math.ceil(ratio) - 1; i++) {
        generations.append(glyph.cloneNode(true));
      }

      var graphicWidth = barWidth / ratio;
      var frames = generations.querySelectorAll('.frame');

      if (frames.length) {
        frames.forEach(function (frame) {
          var image = frame.querySelector('img');
          frame.style.width = graphicWidth + 'px';
          image.width = graphicWidth;
        });
        frames[frames.length - 1].style.width = remainder - 5 + 'px';
      }

      svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
      svg.append('g').call(d3.axisLeft(y).tickSize(0));
    },
    bindUI: function bindUI() {
      var self = this;
      var selector = document.querySelector('#longevitySelector');
      if (selector) selector.addEventListener('change', function (event) {
        self.setMaterial(selector.value);
        canvasHolder.innerHTML = '';
        self.useRatio(settings.materials[selector.value].useTimeHours, settings.materials[selector.value].breakdownTime);
        var newYear = settings.materials[selector.value].breakdownTime;
        data = [{
          'years': newYear
        }];

        if (newYear < 1) {
          document.querySelector('.longevity').innerHTML = '';
          document.querySelector('.generation-glyphs').innerHTML = '';
          self.longevityTimescale();
        } else {
          document.querySelector('.longevity').innerHTML = '';
          document.querySelector('.generation-glyphs').innerHTML = '<div class="frame"><img src="./assets/svg/generation-white.svg" alt="generation icon"></div>';
          self.longevityTimescale();
        }
      });
    },
    setMaterial: function setMaterial(materialID) {
      var self = this;
      var material = settings.materials[materialID];
      var image = document.querySelector('.plastic-longevity .graphic img');

      if (image) {
        image.classList = '';
        image.classList.add(materialID);
        image.setAttribute('src', material.path);
      }

      var title = document.querySelector('.plastic-longevity .stats .material span');
      var useTime = document.querySelector('.plastic-longevity .stats .use-time span'); //let mass = document.querySelector('.plastic-longevity .stats .mass span');

      var breakdownTime = document.querySelector('.plastic-longevity .stats .generations span');
      var lifetimes = document.querySelector('.plastic-longevity .stats .lifetimes span');
      title.textContent = material.title;
      useTime.textContent = material.useTimeDisplay; //mass.textContent = material.mass;

      breakdownTime.textContent = material.breakdownTimeDisplay;
      var lifetimesValue = material.breakdownTime / 76;
      if (lifetimesValue < 1) lifetimesValue = lifetimesValue.toFixed(3);else {
        lifetimesValue = lifetimesValue.toFixed(1);
      }
      lifetimes.textContent = lifetimesValue.toString() + ' lifetimes';
      var averageUseTimeElement = document.querySelector('.baseline span');
      averageUseTimeElement.textContent = '(' + material.useTimeDisplay + ')';
    },
    useRatio: function useRatio(useTimeHours, decomposeYears) {
      var hoursInAYear = 8760;
      var decomposeHours = decomposeYears * hoursInAYear;
      var ratio = decomposeHours / useTimeHours;
      var width;
      var element = document.querySelector('.use-ratio .canvas-holder');

      if (element) {
        width = parseInt(element.offsetWidth);
      }

      var context = canvas.getContext('2d');
      var height = 1200;
      var vw = width,
          vh = height;
      var dotRadius = 2;
      var cellSize = 5;
      var countPerCanvas;

      function resizeCanvas() {
        canvas.width = vw;
        canvas.height = vh;
        countPerCanvas = drawDots();
      }

      resizeCanvas();

      function drawDots() {
        var count = 0;
        totalCount = 0;

        for (var x = dotRadius * 2; x < vw; x += cellSize) {
          for (var y = dotRadius * 2; y < vh; y += cellSize) {
            context.beginPath();
            context.arc(x - dotRadius / 2, y - dotRadius / 2, dotRadius, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(255, 255, 255, .4)';
            context.fill();
            count++;
          }
        }

        return count;
      }

      var yearsPerCanvas = useTimeHours * countPerCanvas / hoursInAYear;
      var searchingFor = generationLength;
      var canvasCopies = Math.floor(ratio / countPerCanvas);
      var generationCount = 1;

      for (var i = 0; i < canvasCopies + 1; i++) {
        // duplicate multiple copies of the canvas to avoid millions of loops
        var totalYears = i * yearsPerCanvas;

        if (totalYears > searchingFor) {
          var node = document.createElement('div');
          node.classList.add('year-indicator');
          var stringResult = generationCount + ' human generations';
          if (generationCount === 1) stringResult = stringResult.slice(0, -1);
          var textnode = document.createTextNode(stringResult);
          node.appendChild(textnode);
          element.appendChild(node);
          searchingFor += generationLength;
          generationCount++;
        }

        element.append(cloneCanvas(canvas));
        canvas.remove();
        totalCount += countPerCanvas;

        if (canvasCopies === 0) {
          totalCount = Math.floor(ratio);
        }
      }

      function cloneCanvas(oldCanvas) {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        context.drawImage(oldCanvas, 0, 0);
        return newCanvas;
      }

      window.addEventListener('resize', resizeCanvas, false);
    },
    miniMap: function miniMap() {
      var self = this;
      var range = document.querySelector('.mini-map');
      var dragger = document.querySelector('.mini-map .dragger');
      var dragging = false,
          startY,
          currentY,
          draggerStartY;
      var moveableHeight = document.querySelector('.plastic-longevity .column-left').getBoundingClientRect().height - dragger.getBoundingClientRect().height;
      var totalProgress = 0;
      dragger.addEventListener('mousedown', function (event) {
        draggerStartY = previousDraggerTransform;
        if (isNaN(draggerStartY)) draggerStartY = 0;
        startY = event.clientY;
        dragging = true;
        updateDragger(event);
        return false;
      });
      document.addEventListener('mousemove', function (event) {
        currentY = event.clientY;

        if (dragging) {
          updateDragger(event);
        }
      });
      document.addEventListener('mouseup', function (event) {
        dragging = false;
      });

      function updateDragger(event) {
        var deltaY = currentY - startY;
        draggerTransform = draggerStartY + deltaY;
        previousDraggerTransform = draggerTransform;

        if (draggerTransform > 0 && draggerTransform < moveableHeight) {
          dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
        } else if (draggerTransform < 0) {
          draggerTransform = 0;
          dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
        } else if (draggerTransform > moveableHeight) {
          draggerTransform = moveableHeight - 1;
          dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
        }

        totalProgress = draggerTransform / (moveableHeight - 1);
        var scrollToY = canvasHolder.offsetHeight * totalProgress;
        unitVisContainer.scrollTo(0, scrollToY);
      }

      unitVisContainer.addEventListener('scroll', function (event) {
        var offset = 0;
        if (canvasHolder.offsetHeight > 10000) offset = 1000;
        var totalProgress = unitVisContainer.scrollTop / (unitVisContainer.scrollHeight - unitVisContainer.clientHeight);
        var number = countElement.querySelector('.number');
        var caption = countElement.querySelector('.caption');
        if (number) number.textContent = Math.floor(totalCount * totalProgress).toLocaleString() + 'x';
        if (caption) countElement.querySelector('.caption').style.opacity = '1';
        draggerTransform = moveableHeight * totalProgress;
        previousDraggerTransform = draggerTransform;
        dragger.style.transform = 'translateY(' + draggerTransform + 'px)';
      });
    }
  };
};

},{}],6:[function(require,module,exports){
"use strict";

module.exports = function () {
  var projectionData, midpointData, higherData, statisticsData, pastData;
  var svg, width, height, chartWidth, chartHeight, padding;
  return {
    init: function init() {
      this.loadData();
    },
    loadData: function loadData() {
      var self = this;

      var preparePast = function preparePast(d, i) {
        var row = {};
        row.year = d['Year'];
        row.amount = d['Global plastics production (million tons)'] * 1000000;
        return row;
      };

      var prepareMidpoint = function prepareMidpoint(d) {
        var row = {};
        row.amount2020A = d['MPW Scenario A 2020'];
        row.amount2020B = d['MPW Scenario B 2020'];
        row.amount2020C = d['MPW Scenario C 2020'];
        row.amount2040A = d['MPW Scenario A 2040'];
        row.amount2040B = d['MPW Scenario B 2040'];
        row.amount2040C = d['MPW Scenario C 2040'];
        row.amount2060A = d['MPW Scenario A 2060'];
        row.amount2060B = d['MPW Scenario B 2060'];
        row.amount2060C = d['MPW Scenario C 2060'];
        row.country = d['Country'];
        return row;
      };

      d3.csv('./assets/js/data/projections-midpoint-world.csv', prepareMidpoint).then(function (data1) {
        projectionData = data1;
        d3.csv('./assets/js/data/global-plastics-production.csv', preparePast).then(function (data1) {
          pastData = data1;
          pastData.unshift({
            'year': '1950',
            'amount': 0
          });
          pastData.push({
            'year': '2015',
            'amount': 0
          });
          self.lineChart();
          self.addAxes();
        });
      });
    },
    lineChart: function lineChart() {
      var self = this;
      var dataset = pastData;
      width = document.querySelector('.projections .plot-container').offsetWidth;
      height = 700;
      padding = {
        top: 50,
        right: 200,
        bottom: 100,
        left: 25
      };
      chartWidth = width - padding.left - padding.right;
      chartHeight = height - padding.top - padding.bottom;
      svg = d3.select('.projections svg').attr('class', 'line-graph').attr('width', width).attr('height', height).append("g").attr("transform", "translate(" + padding.left + "," + padding.top + ")");
      ;
      var xScale = d3.scaleLinear().domain([1950, 2015]).range([0, chartWidth]);
      var maxValue = d3.max(dataset, function (d) {
        return d.amount;
      });
      var yScale = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]);
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + chartHeight + ")").call(d3.axisBottom(xScale)); //.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"))); // y no worky

      svg.append("g").attr("class", "y axis").attr("transform", "translate(" + chartWidth + ", 0)").call(d3.axisRight(yScale));
      var line = d3.line().x(function (d, i) {
        return xScale(d.year);
      }).y(function (d) {
        return yScale(d.amount);
      }).curve(d3.curveMonotoneX); // apply smoothing to the line

      svg.append("path").datum(dataset) // binds data to the line 
      .attr("class", "line").attr("d", line);
      var scenarios = ['A', 'B', 'C'];

      var _loop = function _loop(i) {
        return "break"; // remove me

        var year = 2020 + i * 20;
        var scenario = 'A';
        svg.append('circle').attr('class', 'projection-estimate').attr('cx', function () {
          return xScale(year);
        }).attr('cy', function () {
          var amount = parseInt(projectionData[0]['amount' + year + scenario]);
          yScale(parseInt(projectionData[0]['amount' + year + scenario]));
        }).attr('r', '3').attr('fill', 'white');
      };

      for (var i = 0; i < 3; i++) {
        var _ret = _loop(i);

        if (_ret === "break") break;
      }
    },
    addAxes: function addAxes() {
      var title = svg.append('text').attr('class', 'title').text('Plastic Created Since 1950');
      var textWidth = title.node().getBBox().width;
      var textHeight = title.node().getBBox().height;
      title.attr('transform', 'translate(0, ' + (chartHeight - 40) + ')');
      var xAxisLabel = svg.append('text').attr('class', 'x-axis-label').html('metric tons');
      textWidth = xAxisLabel.node().getBBox().width;
      textHeight = xAxisLabel.node().getBBox().height;
      xAxisLabel.attr('transform', 'translate(' + (chartWidth + 45) + ', ' + (chartHeight + 3) + ')'); // let yAxisLabel = svg.append('text') 
      // .attr('class', 'y-axis-label')
      // .html('Weight (metric tons)');
      // textWidth = yAxisLabel.node().getBBox().width;
      // textHeight = yAxisLabel.node().getBBox().height;
      // yAxisLabel.attr('transform','translate(' + (chartWidth/2 - textWidth/2) + ', ' + (chartHeight + textHeight + (padding.bottom/2)) + ')');
    }
  };
};

},{}],7:[function(require,module,exports){
"use strict";

module.exports = function () {
  var svg;
  var upOneLevelIcon;
  return {
    settings: {},
    init: function init() {
      this.sunburst();
      this.addIcon();
    },
    sunburst: function sunburst() {
      'use strict';

      var format = d3.format(",d");
      var width = document.querySelector('.sunburst').offsetWidth;
      var radius = width / 6;
      var arc = d3.arc().startAngle(function (d) {
        return d.x0;
      }).endAngle(function (d) {
        return d.x1;
      }).padAngle(function (d) {
        return Math.min((d.x1 - d.x0) / 2, 0.005);
      }).padRadius(radius * 1.5).innerRadius(function (d) {
        return d.y0 * radius;
      }).outerRadius(function (d) {
        return Math.max(d.y0 * radius, d.y1 * radius - 1);
      });

      var partition = function partition(data) {
        var root = d3.hierarchy(data).sum(function (d) {
          return d.size;
        }).sort(function (a, b) {
          return b.value - a.value;
        });
        return d3.partition().size([2 * Math.PI, root.height + 1])(root);
      };

      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }

      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }

      function labelTransform(d) {
        var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        var y = (d.y0 + d.y1) / 2 * radius;
        return "rotate(".concat(x - 90, ") translate(").concat(y, ",0) rotate(").concat(x < 180 ? 0 : 180, ")");
      }
      /**
      * Four working methods to load data:
      * (1) Inline data in json format (JS plain objects);
      * (2) From an https URL, which works only afer allowing cross origin requests
      *     on Firefox if the data URL is not the same as your app server;
      * (3) From a local file;
      * (4) Calling require()('@observablehq/flare') (observable-specific). In fact,
      *     The same as (2).
      */
      //var data_url = "https://gist.githubusercontent.com/mbostock/1093025/raw/b40b9fc5b53b40836ead8aa4b4a17d948b491126/flare.json"; // network error!


      var dataURL = "https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json"; //const {require} = new observablehq.Library;
      //require()('@observablehq/flare').then((data, error) => { // works!
      //d3.json(dataURL).then((data, error) => { // works behind proxy!

      d3.json("./assets/js/data/sunburst-countries.json").then(function (data, error) {
        // works!
        //console.log(data);
        var root = partition(data);
        var color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
        root.each(function (d) {
          return d.current = d;
        });
        svg = d3.select('#partitionSVG').style("height", width.toString() + "px").style("font", "9px sans-serif");
        var g = svg.append("g").attr("transform", "translate(".concat(width / 2, ",").concat(width / 2, ")"));
        var path = g.append("g").selectAll("path").data(root.descendants().slice(1)).join("path").attr("fill", function (d) {
          while (d.depth > 1) {
            d = d.parent;
          }

          return color(d.data.name);
        }).attr("fill-opacity", function (d) {
          return arcVisible(d.current) ? d.children ? 0.6 : 0.4 : 0;
        }).attr("d", function (d) {
          return arc(d.current);
        });
        path.filter(function (d) {
          return d.children;
        }).style("cursor", "pointer").on("click", clicked);
        path.append("title").text(function (d) {
          return "".concat(d.ancestors().map(function (d) {
            return d.data.name;
          }).reverse().join("/"), "\n").concat(format(d.value));
        });
        var label = g.append("g").attr("pointer-events", "none").attr("class", "text").attr("text-anchor", "middle").style("user-select", "none").selectAll("text").data(root.descendants().slice(1)).join("text").attr("dy", "0.35em").attr("fill-opacity", function (d) {
          return +labelVisible(d.current);
        }).attr("transform", function (d) {
          return labelTransform(d.current);
        }).attr('font-size', '11px').style("fill", "rgb(200, 200, 200)").text(function (d) {
          return d.data.name;
        });
        var parent = g.append("circle").datum(root).attr("r", radius).attr("fill", "none").attr("pointer-events", "all").on("click", clicked);

        function clicked(p) {
          parent.datum(p.parent || root);
          root.each(function (d) {
            return d.target = {
              x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
              x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth)
            };
          });
          var t = g.transition().duration(750); // Transition the data on all arcs, even the ones that aren’t visible,
          // so that if this transition is interrupted, entering arcs will start
          // the next transition from the desired position.

          path.transition(t).tween("data", function (d) {
            var i = d3.interpolate(d.current, d.target);
            return function (t) {
              return d.current = i(t);
            };
          }).filter(function (d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          }).attr("fill-opacity", function (d) {
            return arcVisible(d.target) ? d.children ? 0.6 : 0.4 : 0;
          }).attrTween("d", function (d) {
            return function () {
              return arc(d.current);
            };
          });
          label.filter(function (d) {
            return this.getAttribute("fill-opacity") || labelVisible(d.target);
          }).transition(t).attr("fill-opacity", function (d) {
            return +labelVisible(d.target);
          }).attrTween("transform", function (d) {
            return function () {
              return labelTransform(d.current);
            };
          });
          if (p.parent === null) upOneLevelIcon.style.opacity = '0';else {
            upOneLevelIcon.style.opacity = '1';
          }
        }
      });
    },
    addIcon: function addIcon() {
      d3.xml('./assets/svg/up-one-level.svg').then(function (data) {
        var icon = data.documentElement;
        upOneLevelIcon = icon;
        icon.classList.add('up-one-level');
        svg.node().append(icon);
        var sunburstWidth = svg.node().parentElement.offsetWidth;
        var iconHeight = sunburstWidth * .1;
        var iconWidth = icon.getBBox().width;
        svg.select('.up-one-level').attr('height', iconHeight).attr('x', sunburstWidth / 2 - iconWidth / 2 - iconWidth * .02).attr('y', sunburstWidth / 2 - iconHeight / 2);
      });
    }
  };
};

},{}],8:[function(require,module,exports){
"use strict";

var HorizontalBar = require('./components/horizontal-bar.js');

var PlasticLongevity = require('./components/plastic-longevity.js');

var Maps = require('./components/maps.js');

var Sunburst = require('./components/sunburst.js');

var ParallelCoordinates = require('./components/parallel-coordinates.js');

var CumulativePlastic = require('./components/cumulative-plastics.js');

var Projections = require('./components/projections.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    HorizontalBar().init();
    PlasticLongevity().init();
    Maps().init();
    Sunburst().init();
    ParallelCoordinates().init();
    Projections().init();
    CumulativePlastic().init();
  });
})();

},{"./components/cumulative-plastics.js":1,"./components/horizontal-bar.js":2,"./components/maps.js":3,"./components/parallel-coordinates.js":4,"./components/plastic-longevity.js":5,"./components/projections.js":6,"./components/sunburst.js":7,"./utils.js":9}],9:[function(require,module,exports){
"use strict";

(function () {
  var appSettings;

  window.utils = function () {
    return {
      appSettings: {
        breakpoints: {
          mobileMax: 767,
          tabletMin: 768,
          tabletMax: 991,
          desktopMin: 992,
          desktopLargeMin: 1200
        }
      },
      mobile: function mobile() {
        return window.innerWidth < this.appSettings.breakpoints.tabletMin;
      },
      tablet: function tablet() {
        return window.innerWidth > this.appSettings.breakpoints.mobileMax && window.innerWidth < this.appSettings.breakpoints.desktopMin;
      },
      desktop: function desktop() {
        return window.innerWidth > this.appSettings.breakpoints.desktopMin;
      },
      getBreakpoint: function getBreakpoint() {
        if (window.innerWidth < this.appSettings.breakpoints.tabletMin) return 'mobile';else if (window.innerWidth < this.appSettings.breakpoints.desktopMin) return 'tablet';else return 'desktop';
      },
      debounce: function debounce(func, wait, immediate) {
        var timeout;
        return function () {
          var context = this,
              args = arguments;

          var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };

          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      },

      /* Purpose: Detect if any of the element is currently within the viewport */
      anyOnScreen: function anyOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
      },

      /* Purpose: Detect if an element is vertically on screen; if the top and bottom of the element are both within the viewport. */
      allOnScreen: function allOnScreen(element) {
        var win = $(window);
        var viewport = {
          top: win.scrollTop(),
          left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = element.offset();
        bounds.right = bounds.left + element.outerWidth();
        bounds.bottom = bounds.top + element.outerHeight();
        return !(viewport.bottom < bounds.top && viewport.top > bounds.bottom);
      },
      secondsToMilliseconds: function secondsToMilliseconds(seconds) {
        return seconds * 1000;
      },
      shuffleArray: function shuffleArray(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
          // While there remain elements to shuffle
          randomIndex = Math.floor(Math.random() * currentIndex); // Pick a remaining element

          currentIndex -= 1;
          temporaryValue = array[currentIndex]; // And swap it with the current element.

          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      },

      /*
      * Purpose: This method allows you to temporarily disable an an element's transition so you can modify its proprties without having it animate those changing properties.
      * Params:
      * 	-element: The element you would like to modify.
      * 	-cssTransformation: The css transformation you would like to make, i.e. {'width': 0, 'height': 0} or 'border', '1px solid black'
      */
      getTransitionDuration: function getTransitionDuration(element) {
        var $element = $(element);
        return utils.secondsToMilliseconds(parseFloat(getComputedStyle($element[0])['transitionDuration']));
      },
      randomInt: function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      isInteger: function isInteger(number) {
        return number % 1 === 0;
      },
      rotate: function rotate(array) {
        array.push(array.shift());
        return array;
      }
    };
  }();

  module.exports = window.utils;
})();

},{}],10:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("leaflet-arc",[],e):"object"==typeof exports?exports["leaflet-arc"]=e():t["leaflet-arc"]=e()}(this,function(){return function(t){function e(o){if(r[o])return r[o].exports;var s=r[o]={exports:{},id:o,loaded:!1};return t[o].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function o(t){return t&&t.__esModule?t:{"default":t}}function s(t,e){if(!t.geometries[0]||!t.geometries[0].coords[0])return[];var r=function(){var r=e.lng-t.geometries[0].coords[0][0]-360;return{v:t.geometries.map(function(t){return r+=360,t.coords.map(function(t){return L.latLng([t[1],t[0]+r])})}).reduce(function(t,e){return t.concat(e)})}}();return"object"===("undefined"==typeof r?"undefined":n(r))?r.v:void 0}var i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=r(2),h=o(a),p=function(t){return{x:t.lng,y:t.lat}};if(!L)throw new Error("Leaflet is not defined");L.Polyline.Arc=function(t,e,r){var o=L.latLng(t),n=L.latLng(e),a=i({vertices:10,offset:10},r),u=new h["default"].GreatCircle(p(o),p(n)),c=u.Arc(a.vertices,{offset:a.offset}),f=s(c,o);return L.polyline(f,a)}},function(t,e){"use strict";var r=Math.PI/180,o=180/Math.PI,s=function(t,e){this.lon=t,this.lat=e,this.x=r*t,this.y=r*e};s.prototype.view=function(){return String(this.lon).slice(0,4)+","+String(this.lat).slice(0,4)},s.prototype.antipode=function(){var t=-1*this.lat,e=this.lon<0?180+this.lon:(180-this.lon)*-1;return new s(e,t)};var i=function(){this.coords=[],this.length=0};i.prototype.move_to=function(t){this.length++,this.coords.push(t)};var n=function(t){this.properties=t||{},this.geometries=[]};n.prototype.json=function(){if(this.geometries.length<=0)return{geometry:{type:"LineString",coordinates:null},type:"Feature",properties:this.properties};if(1==this.geometries.length)return{geometry:{type:"LineString",coordinates:this.geometries[0].coords},type:"Feature",properties:this.properties};for(var t=[],e=0;e<this.geometries.length;e++)t.push(this.geometries[e].coords);return{geometry:{type:"MultiLineString",coordinates:t},type:"Feature",properties:this.properties}},n.prototype.wkt=function(){for(var t="",e="LINESTRING(",r=function(t){e+=t[0]+" "+t[1]+","},o=0;o<this.geometries.length;o++){if(0===this.geometries[o].coords.length)return"LINESTRING(empty)";var s=this.geometries[o].coords;s.forEach(r),t+=e.substring(0,e.length-1)+")"}return t};var a=function(t,e,r){if(!t||void 0===t.x||void 0===t.y)throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");if(!e||void 0===e.x||void 0===e.y)throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");this.start=new s(t.x,t.y),this.end=new s(e.x,e.y),this.properties=r||{};var o=this.start.x-this.end.x,i=this.start.y-this.end.y,n=Math.pow(Math.sin(i/2),2)+Math.cos(this.start.y)*Math.cos(this.end.y)*Math.pow(Math.sin(o/2),2);if(this.g=2*Math.asin(Math.sqrt(n)),this.g==Math.PI)throw new Error("it appears "+t.view()+" and "+e.view()+" are 'antipodal', e.g diametrically opposite, thus there is no single route but rather infinite");if(isNaN(this.g))throw new Error("could not calculate great circle between "+t+" and "+e)};if(a.prototype.interpolate=function(t){var e=Math.sin((1-t)*this.g)/Math.sin(this.g),r=Math.sin(t*this.g)/Math.sin(this.g),s=e*Math.cos(this.start.y)*Math.cos(this.start.x)+r*Math.cos(this.end.y)*Math.cos(this.end.x),i=e*Math.cos(this.start.y)*Math.sin(this.start.x)+r*Math.cos(this.end.y)*Math.sin(this.end.x),n=e*Math.sin(this.start.y)+r*Math.sin(this.end.y),a=o*Math.atan2(n,Math.sqrt(Math.pow(s,2)+Math.pow(i,2))),h=o*Math.atan2(i,s);return[h,a]},a.prototype.Arc=function(t,e){var r=[];if(!t||t<=2)r.push([this.start.lon,this.start.lat]),r.push([this.end.lon,this.end.lat]);else for(var o=1/(t-1),s=0;s<t;++s){var a=o*s,h=this.interpolate(a);r.push(h)}for(var p=!1,u=0,c=e&&e.offset?e.offset:10,f=180-c,l=-180+c,d=360-c,y=1;y<r.length;++y){var g=r[y-1][0],v=r[y][0],M=Math.abs(v-g);M>d&&(v>f&&g<l||g>f&&v<l)?p=!0:M>u&&(u=M)}var m=[];if(p&&u<c){var w=[];m.push(w);for(var x=0;x<r.length;++x){var b=parseFloat(r[x][0]);if(x>0&&Math.abs(b-r[x-1][0])>d){var L=parseFloat(r[x-1][0]),S=parseFloat(r[x-1][1]),j=parseFloat(r[x][0]),E=parseFloat(r[x][1]);if(L>-180&&L<l&&180==j&&x+1<r.length&&r[x-1][0]>-180&&r[x-1][0]<l){w.push([-180,r[x][1]]),x++,w.push([r[x][0],r[x][1]]);continue}if(L>f&&L<180&&j==-180&&x+1<r.length&&r[x-1][0]>f&&r[x-1][0]<180){w.push([180,r[x][1]]),x++,w.push([r[x][0],r[x][1]]);continue}if(L<l&&j>f){var F=L;L=j,j=F;var C=S;S=E,E=C}if(L>f&&j<l&&(j+=360),L<=180&&j>=180&&L<j){var G=(180-L)/(j-L),I=G*E+(1-G)*S;w.push([r[x-1][0]>f?180:-180,I]),w=[],w.push([r[x-1][0]>f?-180:180,I]),m.push(w)}else w=[],m.push(w);w.push([b,r[x][1]])}else w.push([r[x][0],r[x][1]])}}else{var N=[];m.push(N);for(var A=0;A<r.length;++A)N.push([r[A][0],r[A][1]])}for(var P=new n(this.properties),_=0;_<m.length;++_){var O=new i;P.geometries.push(O);for(var q=m[_],R=0;R<q.length;++R)O.move_to(q[R])}return P},"undefined"!=typeof t&&"undefined"!=typeof t.exports)t.exports.Coord=s,t.exports.Arc=n,t.exports.GreatCircle=a;else{var h={};h.Coord=s,h.Arc=n,h.GreatCircle=a}},function(t,e,r){"use strict";t.exports=r(1)}])});

},{}]},{},[8]);
