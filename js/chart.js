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

  var margin = {top: 70, right: 20, bottom: 20, left: 20};
  var cityScale = d3.scale.ordinal();
  var days = d3.scale.ordinal();
  var hours = d3.scale.ordinal().domain(d3.range(HOURS));
  var color = d3.scale.linear().range(["blue", "red"]);

  function initialize() {

    baseChart.initialize();
    onResize(baseChart.getDimensions());

    svg = baseChart.getContainer()
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append('text')
      .classed('type-title', true)
      .attr('text-anchor', 'middle')
      .attr('y', margin.top / -2)
      .attr('dy', '1em')
      .text('Air Quaility');

    visualize();
  }

  function setData(data) {

    var cityMap = d3.nest()
      .key(function(d) { return d.city; })
      .map(data);

    var cityNames = Object.keys(cityMap);
    cityScale.domain(cityNames);

    cities = cityNames.map(function(name) {
      var group = svg.append('g').classed(name, true);
      var city = {
        name: name,
        group: group,
        map: new HeatMap(group),
        data: cityMap[name]
      };

      city.group.append('text').text(city.name);
      city.map.color(color);

      return city;
    });

    console.log("cities", cities);

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
    if (!svg || !cities) return;

    svg
      .select('text.type-title')
      .attr('x', width / 2);

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
