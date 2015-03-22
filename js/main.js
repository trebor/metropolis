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
  var currentSensorIdx = 0;
  var chart = new Chart($('.chart'));
  var model = new Model().on('data', function(data) {
    chart.setData(data);

    setInterval(updateFrame, FRAME_DELAY);
    updateFrame();

    function updateFrame() {
      chart.setFrame(SENSORS[currentSensorIdx], 240);
      currentSensorIdx = (currentSensorIdx + 1) %  SENSORS.length;
    }
  });

});
