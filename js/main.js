requirejs.config({
  baseUrl: 'bower_components',
  paths: {

    // external code

    d3:          'd3/d3.min',
    crossfilter: 'crossfilter/crossfilter.min',
    jquery:      'jquery/dist/jquery.min',
    lodash:      'lodash/dist/lodash.min',

    // local code

    baseChart: '../js/basechart',
    model:     '../js/model',
    chart:     '../js/chart'
  },
  shim: {
  }
});

define(['jquery', 'chart', 'model'], function ($, Chart, Model) {
  var chart = new Chart($('.chart'));
  var model = new Model()
    .on('data', gotData);

  function gotData(data) {
    chart.setData(data.slice(0, 40 * HOURS));
  }
});
