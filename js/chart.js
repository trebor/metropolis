define(["d3", "lodash", "baseChart", "heatMap"], function(d3, _, BaseChart, HeatMap) {

// base svg chart, which auto resizes to fit containing element

var module = function($chartNode, customOptions, extendedEvents) {

  var cities = null;
  var localEvents = [];
  var localOptions = {};
  var dimensions = null;
  var width = null;
  var height = null;
  var svg = null;

  var baseChart = new BaseChart($chartNode, localOptions, localEvents);
  baseChart.visualize = visualize;
  baseChart.setOptions(customOptions);
  baseChart.on('chartResize', onResize);

  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var cityScale = d3.scale.ordinal();
  var days = d3.scale.ordinal();
  var hours = d3.scale.ordinal().domain(d3.range(HOURS));
  var color = d3.scale.linear().range(["blue", "red"]);

  function initialize(_cities) {
    cities = _cities.map(function(city) {return {name: city};});
    console.log("cities", cities);
    cityScale.domain(_cities);
    console.log("cityScale.domain()", cityScale.domain());

    baseChart.initialize();
    onResize(baseChart.getDimensions());

    svg = baseChart.getContainer()
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    cities.forEach(function(city) {
      city.group = svg.append('g').classed(city.name, true);
      city.map = new HeatMap(city.group);
      city.map.color(color);
    });

    visualize();
  }

  function setData(data) {
    var data1 = [
      [1, 2, 3, 4, 5, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [1, 2, 3, 4, 5, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [1, 2, 3, 4, 5, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [1, 2, 3, 4, 5, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [1, 2, 3, 4, 5, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      [1, 2, 3, 4, 5, 1, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    ];

    color.domain(d3.extent(_.flatten(data1)));

    cities.forEach(function(city) {
      city.map.setData(data1);
    });

    visualize();
  }

  function onResize(_dimensions) {
    dimensions = _dimensions;
    width = dimensions.width - (margin.left + margin.right);
    height = dimensions.height - (margin.top + margin.bottom);
    cityScale.rangeBands([0, height], .2);
    visualize();
  }

  function visualize() {
    if (!svg) return;
    cities.forEach(function(city) {
      city.group.attr('transform', 'translate(0, ' + cityScale(city.name) + ')');
      city.map.visualize(width, cityScale.rangeBand());
    });
  }

  // exports

  var exports = {
    setData: setData
  };

  initialize(CITIES);
  return $.extend(exports, baseChart);
};

// end module

  return module;
});
