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

require('leaflet-arc');

module.exports = function () {
  var containerWidth = parseInt(document.querySelector('.fullscreen-map').offsetWidth);
  var containerHeight = parseInt(document.querySelector('.fullscreen-map').offsetHeight);
  var mapWithLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png?access_token={accessToken}';
  var mapWithoutLabels = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png?access_token={accessToken}';
  var asia = {
    width: containerWidth,
    height: 800,
    scale: 800
  };
  var china = {
    lat: 23.638,
    "long": 120.998
  };
  var chinaLocation = new L.LatLng(china.lat, china["long"]);
  var map = L.map('map', {
    zoomControl: false
  }).setView(chinaLocation, 5);
  var svg = d3.select('#map').select('svg');
  var pointsGroup = svg.select('g').attr('class', 'points').append('g');
  var svgLayer = L.svg();
  svgLayer.addTo(map);
  return {
    init: function init() {
      var self = this;
      self.v5Map();
      self.showCountries();
      self.flightPaths(); // self.setScrollPoints();
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
    v5Map: function v5Map() {
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
        format: 'jpg70'
      }).addTo(map);
    },
    showLabels: function showLabels() {
      L.tileLayer(mapWithLabels, {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
        edgeBufferTiles: 2
      }).addTo(map);
    },
    hideLabels: function hideLabels() {
      L.tileLayer(mapWithoutLabels, {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoiamFnb2R3aW4iLCJhIjoiY2lnOGQxaDhiMDZzMXZkbHYzZmN4ZzdsYiJ9.Uwh_L37P-qUoeC-MBSDteA',
        edgeBufferTiles: 2
      }).addTo(map);
    },
    showCountries: function showCountries() {
      d3.json('./assets/js/data/ne_10m_admin_0_countries.json').then(function (json) {
        function style(feature) {} //console.log(feature.properties.NAME);
        // if (feature.properties.NAME === 'China') {
        // 	return {
        // 		fillColor: 'yellow',
        // 		weight: 2,
        // 		opacity: .5,
        // 		color: 'black',
        // 		fillOpacity: 0.5
        // 	};
        // }
        // return {
        // 	fillColor: 'red',
        // 	weight: 2,
        // 	opacity: .5,
        // 	color: 'black',
        // 	fillOpacity: 0.5
        // };
        // var countriesLayer = L.geoJson(json, {style: style});
        // countriesLayer.addTo(map);

      });
    },
    flightPaths: function flightPaths() {
      // var arc = L.Polyline.Arc([23.697809, 120.960518], [35.689487, 139.691711], {
      // 	color: 'rgba(255, 225, 255, .5)',
      // 	vertices: 250
      // }).addTo(map);
      var snapMap = Snap("#map");
      var g = Snap("#svgElem");

      if (g) {
        var rect = g.select('#rect'),
            invisiblePath = g.select('#followPath_invisible'),
            //invisiblePath = snapMap.select('path'), 
        lenPath = Snap.path.getTotalLength(invisiblePath.attr("d")),
            path0Pos = invisiblePath.getPointAtLength(0);
        rect.attr({
          transform: 't' + [path0Pos.x, path0Pos.y] + 'r' + (path0Pos.alpha - 90)
        });
        Snap.animate(0, lenPath, function (val) {
          var pos = invisiblePath.getPointAtLength(val);
          rect.attr({
            transform: 't' + [pos.x, pos.y] + 'r' + (pos.alpha - 90)
          });
        }, 4000, mina.easeinout);
      }
    }
  };
};

},{"leaflet-arc":11}],3:[function(require,module,exports){
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
        }; //console.log(inner(0)[i][0]);
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
  var timescaleHeight = 140;
  var unitVisContainer = document.querySelector('.plastic-longevity .use-ratio');
  var center = {
    x: width / 2,
    y: height / 2
  };
  var settings = {
    materials: {
      coffee: {
        title: '1 Plastic Coffee Lid',
        path: './assets/svg/coffee.svg',
        useTime: 4,
        mass: '157g',
        breakdownTime: 450
      },
      bottle: {
        title: '1 Plastic Bottle',
        path: './assets/svg/bottle.svg',
        useTime: 4,
        mass: '157g',
        breakdownTime: 450
      },
      vegetable: {
        title: 'Vegetable',
        path: './assets/svg/vegetable.svg',
        useTime: .5,
        mass: '',
        breakdownTime: .2
      }
    }
  };
  return {
    init: function init() {
      this.useRatio();
      this.longevityTimescale();
      this.bindUI();
      this.miniMap();
    },
    longevityTimescale: function longevityTimescale() {
      var self = this;
      var generationLength = 76;
      var ratio, remainder;
      var glyph = document.querySelector('.generation-glyphs .frame');
      var data = [{
        'category': '',
        'years': 425
      }];
      var graph = document.querySelector('.longevity');
      var graphicContainer = graph.parentElement;
      var padding = {
        top: 5,
        right: 50,
        bottom: 80,
        left: 100
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
      y.domain(data.map(function (d) {
        return d.category;
      }));
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
      }).attr('y', function (d) {
        return y(d.category) + (y.bandwidth() / 2 - barHeight / 2);
      }).attr('height', barHeight);
      var generations = document.querySelector('.generation-glyphs');

      for (var i = 0; i < Math.ceil(ratio) - 1; i++) {
        generations.append(glyph.cloneNode(true));
      }

      var graphicWidth = barWidth / ratio;
      var frames = generations.querySelectorAll('.frame');
      frames.forEach(function (frame) {
        var image = frame.querySelector('img');
        frame.style.width = graphicWidth + 'px';
        image.width = graphicWidth;
      });
      frames[frames.length - 1].style.width = remainder - 5 + 'px';
      svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
      svg.append('g').call(d3.axisLeft(y).tickSize(0));
    },
    bindUI: function bindUI() {
      var self = this;
      var selector = document.querySelector('#longevitySelector');
      if (selector) selector.addEventListener('change', function (event) {
        self.setMaterial(selector.value);
      });
    },
    setMaterial: function setMaterial(materialID) {
      var self = this;
      var material = settings.materials[materialID];
      var image = document.querySelector('.plastic-longevity .graphic img');
      if (image) image.setAttribute('src', material.path);
      var title = document.querySelector('.plastic-longevity .stats .material span');
      var useTime = document.querySelector('.plastic-longevity .stats .use-time span');
      var mass = document.querySelector('.plastic-longevity .stats .mass span');
      var breakdownTime = document.querySelector('.plastic-longevity .stats .generations span');
      title.textContent = material.title;
      useTime.textContent = material.useTime;
      mass.textContent = material.mass;
      breakdownTime.textContent = material.breakdownTime;
    },
    useRatio: function useRatio() {
      var useTimeHours = 3;
      var decomposeYears = 450;
      var decomposeHours = decomposeYears * 8760;
      var ratio = decomposeHours / useTimeHours;
      var totalCount = 0;
      var width;
      var element = document.querySelector('.use-ratio .canvas-holder');
      var message = element.querySelector('.message');

      if (element) {
        width = parseInt(element.offsetWidth);
      }

      var canvas = document.querySelector('#dotCanvas');
      var context = canvas.getContext('2d');
      var waypoint = new Waypoint({
        element: element,
        handler: function handler(direction) {
          if (direction === 'down') {
            message.style.marginBottom = '4px';
          } else {
            message.style.marginBottom = '-40px';
          }
        },
        offset: -1000
      });
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
        var millionCount = 1;

        for (var x = dotRadius * 2; x < vw; x += cellSize) {
          for (var y = dotRadius * 2; y < vh; y += cellSize) {
            context.beginPath();
            context.arc(x - dotRadius / 2, y - dotRadius / 2, dotRadius, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(204, 204, 204, .7)';
            context.fill();
            context.strokeStyle = 'white';
            context.lineWidth = 1; //context.stroke();

            if (count === 1000000 * millionCount) {
              console.log(count);
              var result = millionCount + ' millionX longer than you used it';
              element.append(result);
              element.append('test string lkj;lkjdfas;lkj');
              millionCount++;
            }

            count++;
          }
        }

        return count;
      }

      var canvasCopies = Math.floor(ratio / countPerCanvas); //console.log('Number of canvases: ', canvasCopies);

      for (var i = 0; i < canvasCopies + 1; i++) {
        // duplicate multiple copies of the canvas to avoid millions of loops
        element.append(cloneCanvas(canvas));
        canvas.remove();
        totalCount += countPerCanvas;
        if (totalCount > 1000000) element.append('1 million times as long as you used it');
      } //console.log('Total count: ', totalCount);


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
      var range = document.querySelector('.mini-map');
      var dragger = document.querySelector('.mini-map .dragger');
      var dragging = false,
          startY,
          currentY,
          draggerStartY;
      var moveableHeight = range.getBoundingClientRect().height - dragger.getBoundingClientRect().height;
      var totalProgress = 0;
      dragger.addEventListener('mousedown', function (event) {
        draggerStartY = dragger.offsetTop;
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
        var currentPos = dragger.offsetTop;
        currentPos = draggerStartY + deltaY;

        if (currentPos > 0 && currentPos < moveableHeight) {
          dragger.style.top = currentPos + 'px';
        } else if (currentPos < 0) {
          dragger.style.top = '0';
        } else if (currentPos > moveableHeight) {
          dragger.style.top = moveableHeight - 1 + 'px';
        }

        totalProgress = dragger.offsetTop / (moveableHeight - 1);
        console.log(unitVisContainer.offsetTop); //unitVisContainer.scrollIntoView();

        var scrollToY = unitVisContainer.offsetTop + unitVisContainer.offsetHeight * totalProgress;
        window.scrollTo(0, scrollToY);
      }
    }
  };
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = function () {
  var svg = d3.select('.scatterplot svg');
  var padding = {
    top: 100,
    left: 120,
    right: 100,
    bottom: 100
  };
  var width = window.innerWidth - padding.right;
  var height = 800;

  var _toolTip;

  return {
    settings: {},
    init: function init() {
      this.toolTip();
      this.scatterplot();
    },
    scatterplot: function scatterplot() {
      //./assets/js/data/surface-ocean-particle-count.csv
      d3.csv('./assets/js/data/exoplanets.csv').then(function (dataset) {
        //./assets/js/data/surface-ocean-particle-count.csv
        // let xExtent = 'habital_zone_distance';
        // let yExtent = 'mass';
        // let radiusExtent = 'radius';
        var xExtent = 'habital_zone_distance';
        var yExtent = 'mass';
        var radiusExtent = 'radius';
        var circle = svg.selectAll('circle').data(dataset).enter().append('circle');
        circle.attr('class', 'planet');
        circle.on('mouseover', _toolTip.show).on('mouseout', _toolTip.hide);
        svg.attr('height', height);
        var maxRadius = 20;
        var colorDomain = d3.extent(dataset, function (d) {
          return +d[xExtent];
        });
        var mass = d3.extent(dataset, function (d) {
          return +d[yExtent];
        });
        var radiusDomain = d3.extent(dataset, function (d) {
          return +d[radiusExtent];
        });
        var xScale = d3.scaleLinear().domain(colorDomain).range([padding.left + 10, width]);
        var yScale = d3.scaleLog().domain(mass).range([padding.top, height - padding.bottom - 16]);
        var radiusScale = d3.scaleSqrt().domain(radiusDomain).range([1, maxRadius]);
        var colorScale = d3.scaleQuantize().domain(colorDomain).range(['#FF3300', '#29AD37', '#27EFFF']); // Set circle size

        circle.attr('cx', function (d) {
          return xScale(d[xExtent]);
        });
        circle.attr('cy', function (d) {
          return yScale(d[yExtent]);
        });
        circle.attr('r', function (d) {
          return radiusScale(d[radiusExtent]);
        });
        circle.attr('fill', function (d) {
          return colorScale(d[xExtent]);
        }); // Add habitable zone x-axis

        svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (height - padding.bottom) + ')').call(d3.axisBottom(xScale).tickFormat(function (d) {
          return d;
        }));
        svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(0, ' + (padding.top - maxRadius).toString() + ')').call(d3.axisBottom(xScale).tickFormat(function (d) {
          return d;
        })); // Add mass y-axis

        svg.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + parseInt(padding.left - 8) + ', 0)').call(d3.axisLeft(yScale));
        svg.append('g').attr('class', 'y-axis').attr('transform', 'translate(' + (width + maxRadius).toString() + ', 0)').call(d3.axisLeft(yScale)); // Label x-axis

        var xAxisLabel = svg.append('text').attr('class', 'label').text('Year?');
        xAxisLabel.attr('transform', 'translate(' + (width / 2 - xAxisLabel.node().getBBox().width / 2).toString() + ',' + (height - padding.bottom + 60).toString() + ')'); // // Label y-axis

        var yAxisLabel = svg.append('text').attr('class', 'label').text('Y-Axis');
        yAxisLabel.attr('transform', 'translate(' + parseInt(padding.left - 50) + ',' + (height / 2 + yAxisLabel.node().getBBox().width / 2).toString() + ') rotate(-90)'); // // Add graph title

        var title = svg.append('text').attr('class', 'title').text('Title');
        title.attr('transform', 'translate(' + (width / 2 - title.node().getBBox().width / 2).toString() + ', 50)');
      });
    },
    toolTip: function toolTip() {
      _toolTip = d3.tip().attr("class", "d3-tip").offset([-12, 0]).html(function (d) {
        return '<div class="tooltip"><h5>' + d['name'] + "</h5></div>";
      });
      svg.call(_toolTip);
    }
  };
};

},{}],6:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {},
    init: function init() {
      var self = this;
    }
  };
};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
          element: pagination,
          handler: function handler(direction) {
            if (direction === 'down') {
              pagination.classList.add('active');
            } else {
              pagination.classList.remove('active');
            }
          },
          offset: 249
        });
        var graphic = document.querySelector('.plastic-longevity');
        var hidePagination = new Waypoint({
          element: graphic,
          handler: function handler(direction) {
            if (direction === 'down') {
              pagination.style.opacity = "0";
            } else {
              pagination.style.opacity = "1";
            }
          },
          offset: 800
        });
      }
    }
  };
};

},{}],9:[function(require,module,exports){
"use strict";

var HorizontalBar = require('./components/horizontal-bar.js');

var PlasticLongevity = require('./components/plastic-longevity.js');

var UI = require('./components/ui.js');

var Maps = require('./components/maps.js');

var Scrolling = require('./components/scrolling.js');

var Sunburst = require('./components/sunburst.js');

var Pie = require('./components/pie.js');

var Scatter = require('./components/scatterplot.js');

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
    Scatter().init();
  });
})();

},{"./components/horizontal-bar.js":1,"./components/maps.js":2,"./components/pie.js":3,"./components/plastic-longevity.js":4,"./components/scatterplot.js":5,"./components/scrolling.js":6,"./components/sunburst.js":7,"./components/ui.js":8,"./utils.js":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("leaflet-arc",[],e):"object"==typeof exports?exports["leaflet-arc"]=e():t["leaflet-arc"]=e()}(this,function(){return function(t){function e(o){if(r[o])return r[o].exports;var s=r[o]={exports:{},id:o,loaded:!1};return t[o].call(s.exports,s,s.exports,e),s.loaded=!0,s.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function o(t){return t&&t.__esModule?t:{"default":t}}function s(t,e){if(!t.geometries[0]||!t.geometries[0].coords[0])return[];var r=function(){var r=e.lng-t.geometries[0].coords[0][0]-360;return{v:t.geometries.map(function(t){return r+=360,t.coords.map(function(t){return L.latLng([t[1],t[0]+r])})}).reduce(function(t,e){return t.concat(e)})}}();return"object"===("undefined"==typeof r?"undefined":n(r))?r.v:void 0}var i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},a=r(2),h=o(a),p=function(t){return{x:t.lng,y:t.lat}};if(!L)throw new Error("Leaflet is not defined");L.Polyline.Arc=function(t,e,r){var o=L.latLng(t),n=L.latLng(e),a=i({vertices:10,offset:10},r),u=new h["default"].GreatCircle(p(o),p(n)),c=u.Arc(a.vertices,{offset:a.offset}),f=s(c,o);return L.polyline(f,a)}},function(t,e){"use strict";var r=Math.PI/180,o=180/Math.PI,s=function(t,e){this.lon=t,this.lat=e,this.x=r*t,this.y=r*e};s.prototype.view=function(){return String(this.lon).slice(0,4)+","+String(this.lat).slice(0,4)},s.prototype.antipode=function(){var t=-1*this.lat,e=this.lon<0?180+this.lon:(180-this.lon)*-1;return new s(e,t)};var i=function(){this.coords=[],this.length=0};i.prototype.move_to=function(t){this.length++,this.coords.push(t)};var n=function(t){this.properties=t||{},this.geometries=[]};n.prototype.json=function(){if(this.geometries.length<=0)return{geometry:{type:"LineString",coordinates:null},type:"Feature",properties:this.properties};if(1==this.geometries.length)return{geometry:{type:"LineString",coordinates:this.geometries[0].coords},type:"Feature",properties:this.properties};for(var t=[],e=0;e<this.geometries.length;e++)t.push(this.geometries[e].coords);return{geometry:{type:"MultiLineString",coordinates:t},type:"Feature",properties:this.properties}},n.prototype.wkt=function(){for(var t="",e="LINESTRING(",r=function(t){e+=t[0]+" "+t[1]+","},o=0;o<this.geometries.length;o++){if(0===this.geometries[o].coords.length)return"LINESTRING(empty)";var s=this.geometries[o].coords;s.forEach(r),t+=e.substring(0,e.length-1)+")"}return t};var a=function(t,e,r){if(!t||void 0===t.x||void 0===t.y)throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");if(!e||void 0===e.x||void 0===e.y)throw new Error("GreatCircle constructor expects two args: start and end objects with x and y properties");this.start=new s(t.x,t.y),this.end=new s(e.x,e.y),this.properties=r||{};var o=this.start.x-this.end.x,i=this.start.y-this.end.y,n=Math.pow(Math.sin(i/2),2)+Math.cos(this.start.y)*Math.cos(this.end.y)*Math.pow(Math.sin(o/2),2);if(this.g=2*Math.asin(Math.sqrt(n)),this.g==Math.PI)throw new Error("it appears "+t.view()+" and "+e.view()+" are 'antipodal', e.g diametrically opposite, thus there is no single route but rather infinite");if(isNaN(this.g))throw new Error("could not calculate great circle between "+t+" and "+e)};if(a.prototype.interpolate=function(t){var e=Math.sin((1-t)*this.g)/Math.sin(this.g),r=Math.sin(t*this.g)/Math.sin(this.g),s=e*Math.cos(this.start.y)*Math.cos(this.start.x)+r*Math.cos(this.end.y)*Math.cos(this.end.x),i=e*Math.cos(this.start.y)*Math.sin(this.start.x)+r*Math.cos(this.end.y)*Math.sin(this.end.x),n=e*Math.sin(this.start.y)+r*Math.sin(this.end.y),a=o*Math.atan2(n,Math.sqrt(Math.pow(s,2)+Math.pow(i,2))),h=o*Math.atan2(i,s);return[h,a]},a.prototype.Arc=function(t,e){var r=[];if(!t||t<=2)r.push([this.start.lon,this.start.lat]),r.push([this.end.lon,this.end.lat]);else for(var o=1/(t-1),s=0;s<t;++s){var a=o*s,h=this.interpolate(a);r.push(h)}for(var p=!1,u=0,c=e&&e.offset?e.offset:10,f=180-c,l=-180+c,d=360-c,y=1;y<r.length;++y){var g=r[y-1][0],v=r[y][0],M=Math.abs(v-g);M>d&&(v>f&&g<l||g>f&&v<l)?p=!0:M>u&&(u=M)}var m=[];if(p&&u<c){var w=[];m.push(w);for(var x=0;x<r.length;++x){var b=parseFloat(r[x][0]);if(x>0&&Math.abs(b-r[x-1][0])>d){var L=parseFloat(r[x-1][0]),S=parseFloat(r[x-1][1]),j=parseFloat(r[x][0]),E=parseFloat(r[x][1]);if(L>-180&&L<l&&180==j&&x+1<r.length&&r[x-1][0]>-180&&r[x-1][0]<l){w.push([-180,r[x][1]]),x++,w.push([r[x][0],r[x][1]]);continue}if(L>f&&L<180&&j==-180&&x+1<r.length&&r[x-1][0]>f&&r[x-1][0]<180){w.push([180,r[x][1]]),x++,w.push([r[x][0],r[x][1]]);continue}if(L<l&&j>f){var F=L;L=j,j=F;var C=S;S=E,E=C}if(L>f&&j<l&&(j+=360),L<=180&&j>=180&&L<j){var G=(180-L)/(j-L),I=G*E+(1-G)*S;w.push([r[x-1][0]>f?180:-180,I]),w=[],w.push([r[x-1][0]>f?-180:180,I]),m.push(w)}else w=[],m.push(w);w.push([b,r[x][1]])}else w.push([r[x][0],r[x][1]])}}else{var N=[];m.push(N);for(var A=0;A<r.length;++A)N.push([r[A][0],r[A][1]])}for(var P=new n(this.properties),_=0;_<m.length;++_){var O=new i;P.geometries.push(O);for(var q=m[_],R=0;R<q.length;++R)O.move_to(q[R])}return P},"undefined"!=typeof t&&"undefined"!=typeof t.exports)t.exports.Coord=s,t.exports.Arc=n,t.exports.GreatCircle=a;else{var h={};h.Coord=s,h.Arc=n,h.GreatCircle=a}},function(t,e,r){"use strict";t.exports=r(1)}])});

},{}]},{},[9]);
