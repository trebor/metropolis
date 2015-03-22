define(["d3", "lodash", "baseChart", "heatMap"], function(d3, _, BaseChart, HeatMap) {

// base svg chart, which auto resizes to fit containing element

var module = function($chartNode, customOptions, extendedEvents) {


  var ROW_COUNT = 7;
  var COL_COUNT = 24;

  var sensorMap = null;
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
  var color = d3.scale.linear().range(["white", "blue"]);
  var colorScale = d3.scale.category10();
  var offset = 0;
  var cityOrder = {
	  "San Francisco": 0,
	  "Boston": 1,
	  "Rio de Janeiro": 2,
	  "Genève": 3,
	  "ಬೆಂಗಳೂರು": 4,
	  "Republik Singapura": 5,
	  "上海市": 6
  };


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
    sensorMap = SENSORS.map(function(sensor) {
      return {
        extent: d3.extent(data, function(d) {return d[sensor];}),
        name: sensor
      };
    }).reduce(function(p, c) {
      p[c.name] = {
        extent: c.extent,
        color: d3.scale.linear()
          .range(["white", colorScale(c.name)])
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
      var city = {
        name: name,
        group: group,
        map: new HeatMap(group, function(d) {return d.id;}),
        data: cityMap[name]
      };

      city.group.append('text').classed('city-title', true).text(city.name);
      city.map.color(function(d) {
        return color(d.value);
      });

      return city;
    });

    visualize();
  }

  function setFrame(type, offset) {
    color = sensorMap[type].color;
    d3.select('.type-title').text(SENSOR_TITLE[type]);
    cities.forEach(function(city) {
      city.map.setData(
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
    setData: setData,
    setFrame: setFrame
  };

  initialize(CITIES);
  return $.extend(exports, baseChart);
};

// end module

  return module;
});
