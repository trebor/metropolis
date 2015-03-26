define(['jquery', 'd3', 'heatMap'], function($, d3, Heatmap) {return function(gSelection) {

  var margin = {top: 2, bottom: 0, left: 0, right: 0};
  var keys = null;

  var heatMap = new Heatmap(gSelection, margin, .2);

  function setData(extent, count) {
    var scale = d3.scale.linear().domain([0, count - 1]).range(extent);
    keys = d3.range(count).map(function(key) {return {date: new Date(), value: scale(key)};});

    var values = keys.map(function(d) {return Math.round(d.value);});
    var xAxis = d3.svg.axis()
      .scale(d3.scale.ordinal().domain(values))
      .orient('top')
      .tickValues(values);

    heatMap.setData(keys, count, function(d, i) {return i;}, xAxis);
    return this;
  }

  function color(color) {
    heatMap.color(function(d) {return color(d.value);});
    return this;
  }

  var exports = {
    setData: setData,
    color: color,
    visualize: heatMap.visualize
  };

  return $.extend(exports, {});
};});
