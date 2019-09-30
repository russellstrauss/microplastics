(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {},
    init: function init() {
      var self = this; // code here
    }
  };
};

},{}],2:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {},
    init: function init() {
      var self = this; // code here
    }
  };
};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {},
    init: function init() {
      var self = this; // code here
    }
  };
};

},{}],4:[function(require,module,exports){
"use strict";

module.exports = function () {
  return {
    settings: {
      graphicHeight: 400
    },
    init: function init() {
      console.log(d3);
      this.addBarGraph();
    },
    addBarGraph: function addBarGraph() {
      var data = [{
        'salesperson': 'Bob',
        'sales': 33
      }, {
        'salesperson': 'Robin',
        'sales': 12
      }, {
        'salesperson': 'Anne',
        'sales': 41
      }, {
        'salesperson': 'Mark',
        'sales': 16
      }, {
        'salesperson': 'Joe',
        'sales': 59
      }, {
        'salesperson': 'Eve',
        'sales': 38
      }, {
        'salesperson': 'Karen',
        'sales': 21
      }, {
        'salesperson': 'Kirsty',
        'sales': 25
      }, {
        'salesperson': 'Chris',
        'sales': 30
      }, {
        'salesperson': 'Lisa',
        'sales': 47
      }, {
        'salesperson': 'Tom',
        'sales': 5
      }, {
        'salesperson': 'Stacy',
        'sales': 20
      }, {
        'salesperson': 'Charles',
        'sales': 13
      }, {
        'salesperson': 'Mary',
        'sales': 29
      }];
      var graphicContainer = document.querySelector('#graphic');
      var padding = {
        top: 60,
        right: 40,
        bottom: 80,
        left: 100
      };
      var width = graphicContainer.offsetWidth - padding.left - padding.right;
      var height = this.settings.graphicHeight - padding.top - padding.bottom;
      var barHeight = 5;
      var barMarginTop = 8;
      var y = d3.scaleBand().range([height, 0]);
      var x = d3.scaleLinear().range([0, width]);
      var svg = d3.select('#graphic').append('svg').attr('class', 'horizontal-bar').attr('width', width + padding.left + padding.right).attr('height', height + padding.top + padding.bottom).append('g').attr('transform', 'translate(' + padding.left + ',' + padding.top + ')'); // format the data

      data.forEach(function (d) {
        d.sales = +d.sales;
      });

      var compare = function compare(a, b) {
        return b.sales - a.sales;
      };

      data = data.sort(compare);
      var maxValue = d3.max(data, function (d) {
        return d.sales;
      }); // Scale the range of the data in the domains

      x.domain([0, maxValue + maxValue * .05]);
      y.domain(data.map(function (d) {
        return d.salesperson;
      }));
      svg.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('width', function (d) {
        return x(d.sales);
      }).attr('y', function (d) {
        return y(d.salesperson) + (y.bandwidth() / 2 - barHeight / 2);
      }).attr('height', barHeight);
      svg.append('g').attr('transform', 'translate(0,' + (height + 6) + ')').call(d3.axisBottom(x));
      svg.append('g').call(d3.axisLeft(y).tickSize(0)); // Add graph title

      var title = svg.append('text').attr('class', 'title').text('Title Here');
      var textWidth = title.node().getBBox().width;
      var textHeight = title.node().getBBox().height;
      title.attr('transform', 'translate(' + (width / 2 - textWidth / 2 - padding.left / 2) + ', ' + (-1 * (padding.top / 2) + 10) + ')');
      var xAxisHeight = 20;
      var xAxisLabel = svg.append('text').attr('class', 'x-axis-label').text('x-axis label here');
      textWidth = xAxisLabel.node().getBBox().width;
      textHeight = xAxisLabel.node().getBBox().height;
      xAxisLabel.attr('transform', 'translate(' + (width / 2 - textWidth / 2 - padding.left / 2) + ', ' + (height + xAxisHeight + padding.bottom / 2) + ')');
      var yAxisLabel = svg.append('text').attr('class', 'y-axis-label').text('y-axis label here');
      textWidth = yAxisLabel.node().getBBox().width;
      textHeight = yAxisLabel.node().getBBox().height;
      yAxisLabel.attr('transform', 'translate(' + (-1 * padding.left + textHeight * 2.5) + ', ' + (height / 2 + textWidth / 2) + ') rotate(-90)');
    }
  };
};

},{}],5:[function(require,module,exports){
"use strict";

var HorizontalBar = require('./components/horizontal-bar.js');

var Graph = require('./components/graph.js');

var Graph2 = require('./components/graph-2.js');

var Graph3 = require('./components/graph-3.js');

var Utilities = require('./utils.js');

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    HorizontalBar().init();
    Graph().init();
    Graph2().init();
    Graph3().init();
  });
})();

},{"./components/graph-2.js":1,"./components/graph-3.js":2,"./components/graph.js":3,"./components/horizontal-bar.js":4,"./utils.js":6}],6:[function(require,module,exports){
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

},{}]},{},[5]);
