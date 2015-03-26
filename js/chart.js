// base svg chart, which auto resizes to fit containing element

define(['d3', 'lodash', 'baseChart', 'heatMap', 'legend'], function(d3, _, BaseChart, HeatMap, Legend) {return function($chartNode, customOptions, extendedEvents) {

  var ROW_COUNT = 7;
  var COL_COUNT = 24;
  var LEGEND_COUNT = 5;
  var LEGEND_HEIGHT = 40;
  var LEGEND_WIDTH = LEGEND_HEIGHT * LEGEND_COUNT;

  var model = null;
  var sensors = null;
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

  var margin = {top: 130, right: 10, bottom: 10, left: 10};
  var cityScale = d3.scale.ordinal();
  var sensorScale = d3.scale.ordinal();
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
  }

  function setData(data) {
    var cityMap = d3.nest()
      .key(function(d) { return d.city_name; })
      .map(data);

    var cityNames = Object.keys(cityMap).sort(function(a,b){
      return cityOrder[a] - cityOrder[b];
    });

    //cityNames = [cityNames[0]];

    cityScale.domain(cityNames);
    sensorScale.domain(SENSORS);

    sensors = SENSORS.map(function(sensor) {

      var extent = d3.extent(data, function(d) {return d[sensor];});
      var color = d3.scale.linear().range(['white', colorScale(sensor)]).domain(extent);
      var sensorGroup = svg.append('g').classed(sensor, true);

      var cities = cityNames.map(function(name) {
        var group = sensorGroup.append('g').classed(name, true);
        var details = CITY_DETAILS[name];
        var yFormat = function(d) {return details.format(new Date(d));};

        group.append('text')
          .classed('city-title', true).text(name)
          .attr('dy', '.9em');

        var hours = d3.range(COL_COUNT);
        var xScale = d3.scale.ordinal().domain(hours);
        var yScale = d3.scale.ordinal();

        var city = {
          name: name,
          group: group,
          map: new HeatMap(group),
          data: cityMap[name],
          xAxis: d3.svg.axis().scale(xScale).orient('top' ).tickValues(hours),
          yAxis: d3.svg.axis().scale(yScale).orient('left').tickPadding(10).tickFormat(yFormat)
        };

        return city;
      });

      var sensorPack = {
        name: sensor,
        extent: extent,
        color: color,
        group: sensorGroup,
        cities: cities
      };

      setSensorTitle(sensorPack);
      return sensorPack;
    });
  }

  function sensorTitle(sensor) {
    return SENSOR_DETAILS[sensor].title + '  ' + SENSOR_DETAILS[sensor].unit + '';
  }

  function setSensorTitle(sensor) {
    sensor.legendG = sensor.group.append('g')
      .classed('legend', true);

    sensor.legend = new Legend(sensor.legendG)
      .color(sensor.color)
      .setData(sensor.extent, LEGEND_COUNT);

    sensor.title = sensor.group.append('text')
      .classed('type-title', true)
      .attr('text-anchor', 'middle')
      .attr('y', margin.top / -2)
      .attr('opacity', 0)
      .attr('dy', '-.2em');

    sensor.title
      .transition()
      .attr('opacity', 0)
      .transition()
      .duration(0)
      .text(sensorTitle(sensor.name))
      .transition()
      .duration(TRANSITION_DURATION / 3)
      .attr('opacity', 1);
  }

  var timeFormat = d3.time.format('%H');
  var dateFormat = d3.time.format('%e %b');

  function setDate(sensor, date) {
    sensors.forEach(function(sensor){
        sensor.cities.forEach(function(city) {
          var yAxisValues = d3.range(ROW_COUNT).map(function(d, i) {
            return date.getTime() + i * MS_INA_DAY;
          });
          city.yAxis.scale().domain(yAxisValues);
          city.yAxis.tickValues(yAxisValues);

          city.map
            .color(function(d) {
              var value = d[sensor.name];
              return  value !== undefined && !isNaN(value) ? sensor.color(value) : '#666';
            })
            .setData(model.oneWeek(city.name, date), COL_COUNT, idAccess, city.xAxis, city.yAxis);
        });
    });

    visualize();
  }


  function idAccess(d) {
    return d.id;
  }

  function onResize(_dimensions) {
    dimensions = _dimensions;
    width = dimensions.width - (margin.left + margin.right);
    height = dimensions.height - (margin.top + margin.bottom);
    cityScale.rangeBands([0, height], 0.02, 0);
    sensorScale.rangeBands([0, width], 0.02, 0);
    visualize();
  }

  function visualize() {
    if (!svg || !sensors) return;

    sensors.forEach(function(sensor) {
      sensor.group
        .transition()
        .duration(TRANSITION_DURATION)
        .attr('transform', 'translate(' + [sensorScale(sensor.name), 0] + ')');

      sensor.cities.forEach(function(city) {
        city.group
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('transform', 'translate(0, ' + cityScale(city.name) + ')');
        city.map.visualize(sensorScale.rangeBand(), cityScale.rangeBand());
      });

      sensor.title
        .attr('x', sensorScale.rangeBand() / 2);

      sensor.legendG
        .attr('transform', 'translate(' + [(sensorScale.rangeBand() - LEGEND_WIDTH) / 2, -LEGEND_HEIGHT + 0] + ')');

      sensor.legend.visualize(LEGEND_WIDTH, LEGEND_HEIGHT);
    });

  }

  function setModel(_model) {
    model = _model;
  }

  // exports

  var exports = {
    setData: setData,
    setModel: setModel,
    setDate: setDate
  };

  initialize(CITIES);
  return $.extend(exports, baseChart);
};});
