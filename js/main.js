requirejs.config({
  baseUrl: 'bower_components',
  paths: {

    // external code

    d3:          'd3/d3.min',
    crossfilter: 'crossfilter/crossfilter.min',
    jquery:      'jquery/dist/jquery.min',
    underscore:  'underscore/underscore-min',
    lodash:      'lodash/lodash.min',
    nunjucks:    'nunjucks/browser/nunjucks.min',
    domReady:    'requirejs-domready/domReady',
    text:        'requirejs-text/text',

    // local code

    baseChart: '../js/basechart',
    heatMap:   '../js/heatmap',
    legend:    '../js/legend',
    model:     '../js/model',
    chart:     '../js/chart',
    popup:     '../js/widgets/popup'
  },
  shim: {
      'underscore': {
          exports: '_'
      }
  }
});

define(['jquery', 'chart', 'model', 'popup', 'nunjucks', 'text!../js/templates/about.html', 'domReady!'], function ($, Chart, Model, Popup, Nunjucks, aboutHTML, doc) {
  var currentSensorIdx = 0;
  var frameCount = 0;
  var minDate = null;
  var maxDate = null;

  var chart = new Chart($('.chart'));
  var model = new Model();

  model.on('data', onData);

  function onData(data) {
    chart.setData(data);
    chart.setModel(model);
    minDate = model.minDate();
    maxDate = new Date(model.maxDate().getTime() - MS_INA_DAY * 14);
    console.log("maxDate", maxDate);
    console.log("model.maxDate()", model.maxDate());

    updateFrame();
    setInterval(updateFrame, FRAME_DELAY);

    function updateFrame() {
      var currentDate = new Date(minDate.getTime() + frameCount * MS_INA_DAY);
      chart.setDate(SENSORS[currentSensorIdx], currentDate);
      ++frameCount;
      if (frameCount % 7 == 0) {
        currentSensorIdx = (currentSensorIdx + 1) %  SENSORS.length;
      }

      if (currentDate.getTime() >= maxDate.getTime()) {
		    frameCount = 0;
	    }
    }
  }

  //init About Popup
  var aboutTemplate = new Nunjucks.Template(aboutHTML);
  var popup = new Popup();
  popup.init({'body': aboutTemplate.render(), 'title': 'About'});

  $('.about-link').on('click', function(e) {
	  e.preventDefault();
	  popup.show();
  });
});
