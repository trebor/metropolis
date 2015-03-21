define(["d3", "lodash", "baseChart", "heatMap"], function(d3, _, BaseChart, HeatMap) {

// base svg chart, which auto resizes to fit containing element

var module = function($chartNode, customOptions, extendedEvents) {

  var localEvents = [];
  var localOptions = {};
  var dimensions = null;
  var width = null;
  var height = null;
  var svg = null;
  var mapG1 = null;
  var mapG2 = null;
  var map1 = null;
  var map2 = null;

  var baseChart = new BaseChart($chartNode, localOptions, localEvents);
  baseChart.visualize = visualize;
  baseChart.setOptions(customOptions);
  baseChart.on('chartResize', onResize);

  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var days = d3.scale.ordinal();
  var hours = d3.scale.ordinal().domain(d3.range(HOURS));
  var color1 = d3.scale.linear().range(["red", "white"]);
  var color2 = d3.scale.linear().range(["blue", "white"]);

  function initialize() {
    baseChart.initialize();
    onResize(baseChart.getDimensions());

    svg = baseChart.getContainer()
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    mapG1 = svg.append('g');
    mapG2 = svg.append('g');
    map1 = new HeatMap(mapG1);
    map2 = new HeatMap(mapG2);

    visualize();
  }

  function setData(data) {

    var data1 = [
      [1, 2, 3],
      [1, 2, 4],
    ];

    var data2 = [
      [3, 2, 3],
      [3, 2, 4],
      [3, 2, 5]
    ];

    color1.domain(d3.extent(_.flatten(data1)));
    color2.domain(d3.extent(_.flatten(data2)));

    map1
      .color(color1)
      .setData(data1);

    map2
      .color(color2)
      .setData(data2);
  }

  function onResize(_dimensions) {
    dimensions = _dimensions;
    width = dimensions.width - (margin.left + margin.right);
    height = dimensions.height - (margin.top + margin.bottom);
    visualize();
  }

  function visualize() {
    if (!svg) return;

    mapG2.attr('transform', 'translate(0, ' + height / 2 + ')');

    map1.render(width, height / 2);
    map2.render(width, height / 2);
  }

  // exports

  var exports = {
    setData: setData
  };

  initialize();
  return $.extend(exports, baseChart);
};

// end module

  return module;
});
