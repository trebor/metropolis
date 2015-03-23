define(['d3', 'lodash', 'baseChart', 'heatMap', 'legend'], function(d3, _, BaseChart, HeatMap, Legend) {

// base svg chart, which auto resizes to fit containing element

var module = function($chartNode, customOptions, extendedEvents) {

  var ROW_COUNT = 7;
  var COL_COUNT = 24;
  var LEGEND_COUNT = 5;
  var LEGEND_HEIGHT = 40;
  var LEGEND_WIDTH = LEGEND_HEIGHT * LEGEND_COUNT;

  var sensorMap = null;
  var cities = null;
  var localEvents = [];
  var localOptions = {};
  var dimensions = null;
  var legend = null;
  var legendG = null;
  var width = null;
  var height = null;
  var svg = null;

  var baseChart = new BaseChart($chartNode, localOptions, localEvents);
  baseChart.visualize = visualize;
  baseChart.setOptions(customOptions);
  baseChart.on('chartResize', onResize);

  var margin = {top: 130, right: 10, bottom: 10, left: 10};
  var cityScale = d3.scale.ordinal();
  var colorScale = d3.scale.category10();
  var offset = 0;
  var cityOrder = {
	  'San Francisco': 0,
	  'Boston': 1,
	  'Rio de Janeiro': 2,
	  'Genève': 3,
	  'ಬೆಂಗಳೂರು': 4,
	  'Republik Singapura': 5,
	  '上海市': 6
  };

  function initialize() {

    baseChart.initialize();
    onResize(baseChart.getDimensions());

    svg = baseChart.getContainer()
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    legendG = svg.append('g').classed('legend', true);
    legend = new Legend(legendG);

    svg.append('text')
      .classed('type-title', true)
      .attr('text-anchor', 'middle')
      .attr('y', margin.top / -2)
      .attr('opacity', 0)
      .attr('dy', '-.2em');

    visualize();
  }

  function setData(data) {
    sensorMap = SENSORS.map(function(sensor) {
      return {
        extent: d3.extent(data, function(d) {return d[sensor];}),
        name: sensor
      };
    }).reduce(function(p, c) {
      var details = SENSOR_DETAILS[c.name];
      p[c.name] = {
        extent: c.extent,
        color: d3.scale.linear()
          .range(details.color)
          .domain(c.extent)
      };
      return p;
    }, {});

    var cityMap = d3.nest()
      .key(function(d) { return d.city_name; })
      .map(data);

    var cityNames = Object.keys(cityMap).sort(function(a,b){
      return cityOrder[a] - cityOrder[b];
    });

    cityScale.domain(cityNames);

    cities = cityNames.map(function(name) {
      var group = svg.append('g').classed(name, true);

      group.append('text')
        .classed('city-title', true).text(name)
        .attr('dy', '.9em');

      var city = {
        name: name,
        group: group,
        map: new HeatMap(group),
        data: cityMap[name]
      };

      return city;
    });

    visualize();
  }

  function sensorName(sensor) {
    return SENSOR_DETAILS[sensor].title + '  ' + SENSOR_DETAILS[sensor].unit + '';
  }

  function setFrame(sensor, offset) {

    var sensorNameStr = sensorName(sensor);

    if (d3.select('.type-title').text() != sensorNameStr) {
      d3.select('.type-title')
        .transition()
        .attr('opacity', 0)
        .transition()
        .duration(0)
        .text(sensorNameStr)
        .transition()
        .duration(TRANSITION_DURATION / 3)
        .attr('opacity', 1);
    }

    legend
      .color(sensorMap[sensor].color)
      .setData(sensorMap[sensor].extent, LEGEND_COUNT);

    cities.forEach(function(city) {
      city.map
        .color(function(d) {return sensorMap[sensor].color(d[sensor]);})
        .setData(
          city.data.slice(offset, offset + ROW_COUNT * COL_COUNT),
          COL_COUNT,
          function(d) {return d.id;});
    });
    visualize();
  }

  function onResize(_dimensions) {
    dimensions = _dimensions;
    width = dimensions.width - (margin.left + margin.right);
    height = dimensions.height - (margin.top + margin.bottom);
    cityScale.rangeBands([0, height], 0.02, 0);
    visualize();
  }

  function visualize() {
    if (!svg || !cities) return;

    svg
      .select('text.type-title')
      .attr('x', width / 2);

    cities.forEach(function(city) {
      city.group
        .transition()
        .duration(TRANSITION_DURATION)
        .attr('transform', 'translate(0, ' + cityScale(city.name) + ')');
      city.map.visualize(width, cityScale.rangeBand());
    });

    legendG
      .attr('transform', 'translate(' + [(width - LEGEND_WIDTH) / 2, -LEGEND_HEIGHT + 0] + ')');

    legend.visualize(LEGEND_WIDTH, LEGEND_HEIGHT);
  }


  // exports

  var exports = {
    setData: setData,
    setFrame: setFrame
  };

  initialize(CITIES);
  return $.extend(exports, baseChart);
};

// end module

  return module;
});
