define(["d3", "baseChart"], function(d3, BaseChart) {

// base svg chart, which auto resizes to fit containing element

var module = function($chartNode, customOptions, extendedEvents) {

  var localEvents = [];
  var localOptions = {};
  var dimensions = null;
  var width = null;
  var height = null;
  var svg = null;
  var days = null;

  var baseChart = new BaseChart($chartNode, localOptions, localEvents);
  baseChart.visualize = visualize;
  baseChart.setOptions(customOptions);
  baseChart.on('chartResize', onResize);

  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal().domain(d3.range(HOURS));
  var color = d3.scale.linear().range(["red", "white"]);

  function initialize() {
    baseChart.initialize();
    onResize(baseChart.getDimensions());

    svg = baseChart.getContainer()
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    visualize();
  }

  function setData(data) {

    days = Math.floor(data.length / HOURS);
    x.domain(d3.range(days));

    data = data.map(function(d, i) {
      var day = Math.floor(i / HOURS);
      var hour = i % HOURS;
      // console.log("day, hour", day, hour);
      return {day: day, hour: hour, value: d.airquality_raw};
    });
    color.domain(d3.extent(data, function(d) {return d.value;}));

    var updates = svg.selectAll('rect.hour')
      .data(data, datumId);

    updates
      .enter()
      .append('rect')
      .classed('hour', true);

    updates
      .exit()
      .remove();

    visualize();
  }

  function datumId(d) {
    return d.day * 100 + d.hour;
  }

  function onResize(_dimensions) {
    dimensions = _dimensions;
    width = dimensions.width - (margin.left + margin.right);
    height = dimensions.height - (margin.top + margin.bottom);
    x.rangeRoundBands([0, width] , 0.1);
    y.rangeRoundBands([height, 0], 0.1);
  }

  function visualize() {
    if (!svg) return;

    svg.selectAll('rect.hour')
      .attr('x', function(d) {return x(d.day);})
      .attr('y', function(d) {return y(d.hour);})
      .attr('width', function(d) {return x.rangeBand();})
      .attr('height', function(d) {return y.rangeBand();})
      .attr('fill', function(d) {return color(d.value);});
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
