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
    heatMap:   '../js/heatmap',
    model:     '../js/model',
    chart:     '../js/chart'
  },
  shim: {
  }
});

define(['jquery', 'chart', 'model'], function ($, Chart, Model) {
  var chart = new Chart($('.chart'));
  var model = new Model().on('data', chart.setData);
  var currentSensorIdx = 0;

  setInterval(updateFrame, 3000);

  function updateFrame() {
    chart.setFrame(SENSORS[currentSensorIdx], 200);
    currentSensorIdx = (currentSensorIdx + 1) %  SENSORS.length;
  }
});
