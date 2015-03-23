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
    legend:    '../js/legend',
    model:     '../js/model',
    chart:     '../js/chart'
  },
  shim: {
  }
});

define(['jquery', 'chart', 'model'], function ($, Chart, Model) {
  var currentSensorIdx = 0;
  var frameCount = 0;
  //to-do: change this arbitrary number to react to complete data sets
  //		when the data sets are complete
  var maxIndex = 1416;
  var minIndex = 24;
  var timeIndex = minIndex;

  var chart = new Chart($('.chart'));
  var model = new Model().on('data', function(data) {

    chart.setData(data);

    setInterval(updateFrame, FRAME_DELAY);
    updateFrame();

    function updateFrame() {
      chart.setFrame(SENSORS[currentSensorIdx], timeIndex);
      ++frameCount;
      if (frameCount % 7 == 0) {
        currentSensorIdx = (currentSensorIdx + 1) %  SENSORS.length;
      }

      timeIndex += 24;
	    if (timeIndex > maxIndex) {
		    timeIndex = minIndex;
	    }
    }
  });

});
