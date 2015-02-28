requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    d3: 'd3/d3.min',
    jquery: 'jquery/dist/jquery.min'
  },
  shim: {
  }
});

define(['d3', 'jquery'], function (d3, $) {
  var width = $('.chart').width();
  var height = $('.chart').height();

  var svg = d3.select('.chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', height / 2)
    .style('fill', 'red');
});
