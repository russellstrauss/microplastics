(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";

module.exports = function () {
  var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
  var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
  var map, zoom, center;
  var asia = {
    width: containerWidth,
    height: 800,
    scale: 800
  };
  var china = {
    lat: 23.638,
    long: 120.998 //asia.projection = d3.geoMercator().translate([asia.width * .25, asia.height * .75]).scale([asia.scale]);

  };
  asia.projection = d3.geoMercator().center([-84.386330, 33.753746]).scale(1500);
  return {
    init: function init() {
      var self = this;
      self.v5Map(); // self.setScrollPoints();
    },
    setScrollPoints: function setScrollPoints() {
      var self = this;
      var veil = document.querySelector('.veil');
      var waypoint = new Waypoint({
        element: document.getElementById('showAsia'),
        handler: function handler(direction) {
          if (direction === 'down') {
            map.transition().duration(2000).ease(d3.easeCubicInOut).call(zoom.transform, d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(.5).translate(-4000, 500));
          } else {
            veil.classList.add('active'); //self.resetMap();
          }
        },
        offset: 0
      });
      waypoint = new Waypoint({
        element: document.getElementById('showAsia'),
        handler: function handler(direction) {
          if (direction === 'down') {
            veil.classList.remove('active');
          } else {//veil.classList.add('active');
          }
        },
        offset: 500
      });
      waypoint = new Waypoint({
        element: document.getElementById('showUS'),
        handler: function handler(direction) {
          if (direction === 'down') {
            map.transition().duration(1200).ease(d3.easeCubicInOut).call(zoom.transform, d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(.75).translate(2500, 1500));
          } else {//veil.classList.add('active');
          }
        }
      });
      waypoint = new Waypoint({
        element: document.getElementById('showJapan'),
        handler: function handler(direction) {
          if (direction === 'down') {
            map.transition().duration(1200).ease(d3.easeCubicInOut).call(zoom.transform, d3.zoomIdentity.translate(containerWidth / 2, containerHeight / 2).scale(1).translate(-4500, 1650));
          } else {//veil.classList.add('active');
          }
        },
        offset: 800
      });
    },
    v5Map: function v5Map() {
      var map = d3.select('.fullscreen-map');
      var mapWidth = parseInt(map.offsetWidth);
      var mapHeight = parseInt(map.offsetHeight);
      var atlLatLng = new L.LatLng(33.7771, -84.3900);
      var chinaLocation = new L.LatLng(china.lat, china.long);
      var myMap = L.map('map').setView(chinaLocation, 5);
      var vertices = d3.map();
      var activeMapType = 'nodes_links';
      L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}', {
        maxZoom: 10,
        minZoom: 3,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA'
      }).addTo(myMap);
      var svgLayer = L.svg();
      svgLayer.addTo(myMap);
      var svg = d3.select('#map').select('svg');
      var nodeLinkG = svg.select('g').attr('class', 'leaflet-zoom-hide');

      function updateLayers() {
        nodeLinkG.selectAll('.grid-node').attr('cx', function (d) {
          return myMap.latLngToLayerPoint(d.LatLng).x;
        }).attr('cy', function (d) {
          return myMap.latLngToLayerPoint(d.LatLng).y;
        });
        nodeLinkG.selectAll('.grid-link').attr('x1', function (d) {
          return myMap.latLngToLayerPoint(d.node1.LatLng).x;
        }).attr('y1', function (d) {
          return myMap.latLngToLayerPoint(d.node1.LatLng).y;
        }).attr('x2', function (d) {
          return myMap.latLngToLayerPoint(d.node2.LatLng).x;
        }).attr('y2', function (d) {
          return myMap.latLngToLayerPoint(d.node2.LatLng).y;
        });
      }

      d3.selectAll('.btn-group > .btn.btn-secondary').on('click', function () {
        var newMapType = d3.select(this).attr('data-type');
        d3.selectAll('.btn.btn-secondary.active').classed('active', false);
        cleanUpMap(activeMapType);
        showOnMap(newMapType);
        activeMapType = newMapType;
      });

      function cleanUpMap(type) {
        switch (type) {
          case 'cleared':
            break;

          case 'nodes_links':
            nodeLinkG.attr('visibility', 'hidden');
            break;
        }
      }

      function showOnMap(type) {
        switch (type) {
          case 'cleared':
            break;

          case 'nodes_links':
            nodeLinkG.attr('visibility', 'visible');
            break;
        }
      }
    }
  };
};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function () {
  var pie = document.querySelector('.eat-pie');
  var data;
  var width;
  if (pie) width = parseInt(pie.offsetWidth);
  var height = width;
  var radius = Math.min(width, height) / 2;
  var color;
  var svg;
  var slices, polyline;
  var innerArc = d3.arc().innerRadius(radius * .8).outerRadius(radius * 1.25);
  var outerArc = d3.arc().innerRadius(width / 3).outerRadius(radius);

  var key = function key(d) {
    return d.data.category;
  };

  var currentYearIndex = 0;
  return {
    settings: {},
    init: function init() {
      var self = this;
      d3.csv('./assets/js/data/global-plastic-fate.csv', function (fate) {
        data = d3.nest().key(function (d) {
          return d.category;
        }).entries(fate);
        self.eatPie();
        self.bindEvents();
      });
    },
    eatPie: function eatPie() {
      var self = this;
      svg = d3.select(".eat-pie").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      svg.append('circle').attr('class', 'mask').attr('cx', 0).attr('cy', 0).attr('r', width / 3).attr('fill', 'white');
      slices = svg.append("g").attr("class", "slices");
      svg.append("g").attr("class", "labels");
      svg.append("g").attr("class", "lines"); // Compute the position of each group on the pie:

      pie = d3.pie().value(function (d) {
        if (parseInt(d.values[currentYearIndex].percentage) === 0) return 1;
        return d.values[currentYearIndex].percentage;
      });
      color = d3.scaleOrdinal().domain(data).range(["black", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]); // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.

      slices.selectAll('path').data(pie(data)).enter().append('path').style("opacity", 0.7).attr('d', outerArc).attr('fill', function (d) {
        return color(d.data.key);
      });
      self.eatMorePie();
    },
    eatMorePie: function eatMorePie() {
      pie.value(function (d) {
        if (parseInt(d.values[currentYearIndex].percentage) === 0) return 1;
        return d.values[currentYearIndex].percentage;
      });
      slices = svg.selectAll('path').data(pie(data)).transition().duration(250).attr('d', outerArc).attr('fill', function (d) {
        return color(d.data.key);
      });
      /* ------- TEXT LABELS -------*/

      var text = svg.select(".labels").selectAll("text").data(pie(data), key); // text.enter()
      // .append("text")
      // .attr("dy", ".35em")
      // .text(function(d, key) {
      // 	console.log(d.data.key)
      // 	return d.data.key;
      // });

      function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
      }

      var arc = d3.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
      text.transition().duration(1000).attrTween("transform", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        };
      }).styleTween("text-anchor", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      });
      text.exit().remove();
      /* ------- SLICE TO TEXT POLYLINES -------*/

      var polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key);
      polyline.enter().append("polyline");
      var arcCentroid = svg.select('.labels').selectAll('circle').data(pie(data), key);
      var arcEnter = arcCentroid.enter().append('circle'); //console.log(arcEnter);

      arcCentroid //.transition().duration(1000)
      .attr('cx', function (d) {
        var centroid = outerArc.centroid(d);
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);

        var inner = function inner(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
        };

        console.log('cx'); //console.log(inner(0)[i][0]);
        //return parseInt(inner(0)[0]);
        //console.log(outerArc.centroid(d));

        return outerArc.centroid(d)[0];
      }).attr('cy', function (d) {
        var centroid = outerArc.centroid(d);

        var inner = function inner(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
        }; //return parseInt(inner(0)[i][0]);


        return outerArc.centroid(d)[1];
      }).attr('class', 'centroid').attr('r', 10).attr('fill', 'black');
      polyline.transition().duration(1000).attrTween("points", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [innerArc.centroid(d2), outerArc.centroid(d2), pos];
        };
      }); //arcCentroid.exit().remove()

      polyline.exit().remove();
    },
    decrementYear: function decrementYear() {
      currentYearIndex--;
      this.eatMorePie();
    },
    incrementYear: function incrementYear() {
      currentYearIndex++;
      this.eatMorePie();
    },
    bindEvents: function bindEvents() {
      var self = this;
      var inputSteppers = document.querySelectorAll('.input-stepper');
      inputSteppers.forEach(function (inputStepper) {
        inputStepper.style.width = width.toString() + 'px';
        var input = inputStepper.querySelector('input');
        var increase = inputStepper.querySelector('.increase');
        if (increase) increase.addEventListener('click', function () {
          var max = parseInt(input.getAttribute('max'));

          if (input.value < max) {
            input.value = parseInt(input.value) + 1;
            self.incrementYear();
          }
        });
        var decrease = inputStepper.querySelector('.decrease');
        if (decrease) decrease.addEventListener('click', function () {
          var min = parseInt(input.getAttribute('min'));

          if (input.value > min) {
            input.value = parseInt(input.value) - 1;
            self.decrementYear();
          }
        });
      });
    }
  };
};

},{}],4:[function(require,module,exports){
"use strict";

module.exports = function () {
  var graphic = document.querySelector('.plastic-longevity .graphic');
  var data;
  var width;
  if (graphic) width = parseInt(graphic.offsetWidth);
  var height = 500;
  var svg;
  var cupWidth, cupHeight;
  var timescaleHeight = 200;
  var center = {
    x: width / 2,
    y: height / 2
  };
  return {
    init: function init() {
      this.setUpPlot();
      this.longevityTimescale();
    },
    setUpPlot: function setUpPlot() {
      var self = this;
      svg = d3.select(graphic).append('svg').attr('width', width).attr('height', height); // show center
      //svg.append('circle').attr('class', 'mask').attr('cx', center.x).attr('cy', center.y).attr('r', 10).attr('fill', 'black');

      var cupWidth = 250,
          cupHeight = 410;
      var image = svg.append('svg:image').attr('xlink:href', './assets/svg/starbucks.svg').attr('width', cupWidth).attr('height', cupHeight).attr('x', center.x - cupWidth / 2).attr('y', center.y - cupHeight / 2).attr('class', 'cup');
      self.particles();
    },
    particles: function particles() {
      var colorScale = d3.scaleSequential(d3.interpolateViridis);
      var network;
      var particles = [];

      for (var i = 0; i < 1000; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // x: 0,
          // y: 0,
          radius: i % 3 + 2
        });
      }

      var nodeG = svg.append('g').attr('class', 'nodes-group');
      var forceStrength = .1;

      function charge(d) {
        console.log(-Math.pow(d.radius, 2.0) * forceStrength);
        return -Math.pow(d.radius, 2.0) * forceStrength;
      }

      var simulation = d3.forceSimulation().velocityDecay(0.03) //.force('charge', charge)
      .force('charge', d3.forceManyBody().strength(-.5)).force('repelForce', d3.forceManyBody().strength(-1).distanceMax(10).distanceMin(5)).force('center', d3.forceCenter(center.x, center.y));
      var nodeEnter = nodeG.selectAll().data(particles).enter().append('circle').attr('class', 'node').attr('r', function (d) {
        return d.radius;
      }).attr('fill', function (d) {
        return 'rgb(200, 200, 200)';
      }).attr('stroke', function (d) {
        return 'rgba(0, 0, 0, .5)';
      }).attr('opacity', 0).attr('stroke-width', 1);

      var updateParticles = function updateParticles() {
        nodeEnter = nodeG.selectAll('.node').transition().duration(500) // remove me
        .attr('opacity', 1).data(particles).merge(nodeEnter);
        nodeEnter.exit().transition().remove(); // Update and restart the simulation.

        simulation.nodes(nodeEnter);
        simulation.alpha(1).restart();
      };

      svg.on('click', function () {
        simulation.force('repelForce', d3.forceManyBody().strength(-1).distanceMax(2).distanceMin(1));
        particles = [];

        for (var _i = 0; _i < 1000; _i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: _i % 3 + 2
          });
        }

        updateParticles();
        svg.select('.cup').attr('opacity', 0);
      });
      simulation.nodes(particles).on('tick', tickSimulation);
      var done = false;

      function tickSimulation() {
        nodeEnter.attr('cx', function (d) {
          return d.x;
        }).attr('cy', function (d) {
          return d.y;
        });
      }
    },
    longevityTimescale: function longevityTimescale() {
      var self = this;
      var data = [{
        'river': 'polypropylene',
        'countries': ['Indonesia'],
        'amount': 450
      }];
      var graphs = document.querySelectorAll('.longevity');
      graphs.forEach(function (graph) {
        var graphicContainer = graph.parentElement;
        var padding = {
          top: 60,
          right: 50,
          bottom: 80,
          left: 100
        };
        var width = graphicContainer.offsetWidth - padding.left - padding.right;
        var height = timescaleHeight - padding.top - padding.bottom;
        var barHeight = 20;
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
        var xAxisHeight = 20;
        var xAxisLabel = svg.append('text').attr('class', 'x-axis-label').html('Years to Break Down');
        var textWidth = xAxisLabel.node().getBBox().width;
        var textHeight = xAxisLabel.node().getBBox().height;
        xAxisLabel.attr('transform', 'translate(' + (width / 2 - textWidth) + ', ' + (height + xAxisHeight + padding.bottom / 2) + ')');
        svg.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('width', function (d) {
          return x(d.amount);
        }).attr('y', function (d) {
          return y(d.river) + (y.bandwidth() / 2 - barHeight / 2);
        }).attr('height', barHeight);
        svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
        svg.append('g').call(d3.axisLeft(y).tickSize(0));
      });
    }
  };
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {},
    init: function init() {
      var self = this;
    }
  };
};

},{}],6:[function(require,module,exports){
"use strict";

module.exports = function () {
  var sunburst = document.querySelector('.sunburst');
  var data;
  var width;
  if (sunburst) width = parseInt(sunburst.offsetWidth);
  var height = width;
  return {
    settings: {},
    init: function init() {
      var self = this;
      if (sunburst) self.sunburst();
    },
    sunburst: function sunburst() {
      var radius = Math.min(width, height) / 2; // Breadcrumb dimensions: width, height, spacing, width of tip/tail.

      var b = {
        w: 75,
        h: 30,
        s: 3,
        t: 10
      }; // Mapping of step names to colors.

      var colors = {
        "home": "#ECD078",
        "product": "#D95B43",
        "search": "#C02942",
        "account": "#542437",
        "other": "#53777A",
        "end": "#083047"
      }; // Total size of all segments; we set this later, after loading the data.

      var totalSize = 0;
      var vis = d3.select(".chart").append("svg:svg").attr("width", width).attr("height", height).append("svg:g").attr("id", "container").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      var partition = d3.partition().size([2 * Math.PI, radius * radius]);
      var arc = d3.arc().startAngle(function (d) {
        return d.x0;
      }).endAngle(function (d) {
        return d.x1;
      }).innerRadius(function (d) {
        return Math.sqrt(d.y0);
      }).outerRadius(function (d) {
        return Math.sqrt(d.y1);
      }); // Use d3.text and d3.csvParseRows so that we do not need to have a header
      // row, and can receive the csv as an array of arrays.

      d3.text("./assets/js/data/global-plastic-fate.csv", function (text) {// var csv = d3.csvParseRows(text);
        // var json = buildHierarchy(csv);
        //console.log(json);
      });
      d3.text("./assets/js/data/test-visit-sequences.csv", function (text) {
        var csv = d3.csvParseRows(text); //console.log(json);

        var json = buildHierarchy(csv);
        createVisualization(json);
      }); // Main function to draw and set up the visualization, once we have the data.

      function createVisualization(json) {
        // Basic setup of page elements.
        initializeBreadcrumbTrail();
        drawLegend();
        d3.select("#togglelegend").on("click", toggleLegend); // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.

        vis.append("svg:circle").attr("r", radius).style("opacity", 0); // Turn the data into a d3 hierarchy and calculate the sums.

        var root = d3.hierarchy(json).sum(function (d) {
          return d.size;
        }).sort(function (a, b) {
          return b.value - a.value;
        }); // For efficiency, filter nodes to keep only those large enough to see.

        var nodes = partition(root).descendants().filter(function (d) {
          return d.x1 - d.x0 > 0.005; // 0.005 radians = 0.29 degrees
        });
        var path = vis.data([json]).selectAll("path").data(nodes).enter().append("svg:path").attr("display", function (d) {
          return d.depth ? null : "none";
        }).attr("d", arc).attr("fill-rule", "evenodd").style("fill", function (d) {
          return colors[d.data.name];
        }).style("opacity", 1).on("mouseover", mouseover); // Add the mouseleave handler to the bounding circle.

        d3.select("#container").on("mouseleave", mouseleave); // Get total size of the tree = value of root node from partition.

        totalSize = path.datum().value;
      }

      ; // Fade all but the current sequence, and show it in the breadcrumb trail.

      function mouseover(d) {
        var percentage = (100 * d.value / totalSize).toPrecision(3);
        var percentageString = percentage + "%";

        if (percentage < 0.1) {
          percentageString = "< 0.1%";
        }

        d3.select(".percentage").text(percentageString);
        d3.select(".explanation").style("visibility", "");
        var sequenceArray = d.ancestors().reverse();
        sequenceArray.shift(); // remove root node from the array

        updateBreadcrumbs(sequenceArray, percentageString); // Fade all the segments.

        d3.selectAll("path").style("opacity", 0.3); // Then highlight only those that are an ancestor of the current segment.

        vis.selectAll("path").filter(function (node) {
          return sequenceArray.indexOf(node) >= 0;
        }).style("opacity", 1);
      } // Restore everything to full opacity when moving off the visualization.


      function mouseleave(d) {
        // Hide the breadcrumb trail
        d3.select(".trail").style("visibility", "hidden"); // Deactivate all segments during transition.

        d3.selectAll("path").on("mouseover", null); // Transition each segment to full opacity and then reactivate it.

        d3.selectAll("path").transition().duration(1000).style("opacity", 1).on("end", function () {
          d3.select(this).on("mouseover", mouseover);
        });
        d3.select(".explanation").style("visibility", "hidden");
      }

      function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3.select(".sunburst .sequence").append("svg:svg").attr("width", width).attr("height", 50).attr("class", "trail"); // Add the label at the end, for the percentage.

        trail.append("svg:text").attr("class", "endlabel").style("fill", "#000");
      } // Generate a string that describes the points of a breadcrumb polygon.


      function breadcrumbPoints(d, i) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + b.h / 2);
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);

        if (i > 0) {
          // Leftmost breadcrumb; don't include 6th vertex.
          points.push(b.t + "," + b.h / 2);
        }

        return points.join(" ");
      } // Update the breadcrumb trail to show the current sequence and percentage.


      function updateBreadcrumbs(nodeArray, percentageString) {
        // Data join; key function combines name and depth (= position in sequence).
        var trail = d3.select(".trail").selectAll("g").data(nodeArray, function (d) {
          return d.data.name + d.depth;
        }); // Remove exiting nodes.

        trail.exit().remove(); // Add breadcrumb and label for entering nodes.

        var entering = trail.enter().append("svg:g");
        entering.append("svg:polygon").attr("points", breadcrumbPoints).style("fill", function (d) {
          return colors[d.data.name];
        });
        entering.append("svg:text").attr("x", (b.w + b.t) / 2).attr("y", b.h / 2).attr("dy", "0.35em").attr("text-anchor", "middle").text(function (d) {
          return d.data.name;
        }); // Merge enter and update selections; set position for all nodes.

        entering.merge(trail).attr("transform", function (d, i) {
          return "translate(" + i * (b.w + b.s) + ", 0)";
        }); // Now move and update the percentage at the end.

        d3.select(".trail").select(".endlabel").attr("x", (nodeArray.length + 0.5) * (b.w + b.s)).attr("y", b.h / 2).attr("dy", "0.35em").attr("text-anchor", "middle").text(percentageString); // Make the breadcrumb trail visible, if it's hidden.

        d3.select(".trail").style("visibility", "");
      }

      function drawLegend() {
        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        var li = {
          w: 75,
          h: 30,
          s: 3,
          r: 3
        };
        var legend = d3.select("#legend").append("svg:svg").attr("width", li.w).attr("height", d3.keys(colors).length * (li.h + li.s));
        var g = legend.selectAll("g").data(d3.entries(colors)).enter().append("svg:g").attr("transform", function (d, i) {
          return "translate(0," + i * (li.h + li.s) + ")";
        });
        g.append("svg:rect").attr("rx", li.r).attr("ry", li.r).attr("width", li.w).attr("height", li.h).style("fill", function (d) {
          return d.value;
        });
        g.append("svg:text").attr("x", li.w / 2).attr("y", li.h / 2).attr("dy", "0.35em").attr("text-anchor", "middle").text(function (d) {
          return d.key;
        });
      }

      function toggleLegend() {
        var legend = d3.select("#legend");

        if (legend.style("visibility") == "hidden") {
          legend.style("visibility", "");
        } else {
          legend.style("visibility", "hidden");
        }
      } // Take a 2-column CSV and transform it into a hierarchical structure suitable
      // for a partition layout. The first column is a sequence of step names, from
      // root to leaf, separated by hyphens. The second column is a count of how 
      // often that sequence occurred.


      function buildHierarchy(csv) {
        var root = {
          "name": "root",
          "children": []
        };

        for (var i = 0; i < csv.length; i++) {
          var sequence = csv[i][0];
          var size = +csv[i][1];

          if (isNaN(size)) {
            // e.g. if this is a header row
            continue;
          }

          var parts = sequence.split("-");
          var currentNode = root;

          for (var j = 0; j < parts.length; j++) {
            var children = currentNode["children"];
            var nodeName = parts[j];
            var childNode;

            if (j + 1 < parts.length) {
              // Not yet at the end of the sequence; move down the tree.
              var foundChild = false;

              for (var k = 0; k < children.length; k++) {
                if (children[k]["name"] == nodeName) {
                  childNode = children[k];
                  foundChild = true;
                  break;
                }
              } // If we don't already have a child node for this branch, create it.


              if (!foundChild) {
                childNode = {
                  "name": nodeName,
                  "children": []
                };
                children.push(childNode);
              }

              currentNode = childNode;
            } else {
              // Reached the end of the sequence; create a leaf node.
              childNode = {
                "name": nodeName,
                "size": size
              };
              children.push(childNode);
            }
          }
        }

        return root;
      }

      ;
    }
  };
};

},{}],7:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {
      options: ['option 1', 'option 2', 'option 3']
    },
    init: function init() {
      var self = this;
      self.pagination();
      var cycle = document.querySelector('.cycle');
    },
    pagination: function pagination() {
      var pagination = document.querySelector('.pagination');

      if (pagination) {
        var waypoint = new Waypoint({
          element: document.querySelector('.pagination'),
          handler: function handler(direction) {
            if (direction === 'down') {
              pagination.classList.add('active');
            } else {
              pagination.classList.remove('active');
            }
          },
          offset: 249
        });
      }
    }
  };
};

},{}],8:[function(require,module,exports){
"use strict";

var HorizontalBar = require('./components/horizontal-bar.js');

var PlasticLongevity = require('./components/plastic-longevity.js');

var UI = require('./components/ui.js');

var Maps = require('./components/maps.js');

var Scrolling = require('./components/scrolling.js');

var Sunburst = require('./components/sunburst.js');

var Pie = require('./components/pie.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    HorizontalBar().init();
    PlasticLongevity().init();
    UI().init();
    Maps().init();
    Scrolling().init();
    Sunburst().init();
    Pie().init();
  });
})();

},{"./components/horizontal-bar.js":1,"./components/maps.js":2,"./components/pie.js":3,"./components/plastic-longevity.js":4,"./components/scrolling.js":5,"./components/sunburst.js":6,"./components/ui.js":7,"./utils.js":9}],9:[function(require,module,exports){
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

},{}]},{},[8]);
