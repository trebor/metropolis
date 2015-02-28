define(["d3", "baseChart"], function(d3, BaseChart) {

// base svg chart, which auto resizes to fit containing element

var module = function($chartNode, customOptions, extendedEvents) {

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

  var margin = {top: 0, right: 0, bottom: 0, left: 0};
  // var margin = {top: 20, right: 60, bottom: 50, left: 50};
  var x = d3.scale.linear();
  var y = d3.scale.linear();

  function initialize() {
    baseChart.initialize();
    onResize(baseChart.getDimensions());

    svg = baseChart.getContainer()
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append('circle')
      .style('fill', 'red');

    visualize();
  }

  function setData(data) {
    // x.domain(d3.extent(data.records, function(d) { return d.date; }));
    // y.domain(d3.extent(data.records, function(d) { return d.temperature; }));
  }

  function onResize(_dimensions) {
    dimensions = _dimensions;
    width = dimensions.width - (margin.left + margin.right);
    height = dimensions.height - (margin.top + margin.bottom);
    x.range([0, dimensions.width - margin.right]);
    y.range([dimensions.height - margin.bottom, 0]);
  }

  function visualize() {
    if (!svg) return;

    svg.select('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', height / 2);
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
