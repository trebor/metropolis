requirejs.config({
  baseUrl: 'bower_components',
  paths: {

    // external code

    d3:        'd3/d3.min',
    jquery:    'jquery/dist/jquery.min',
    lodash:    'lodash/dist/lodash.min',

    // local code

    baseChart: '../js/basechart',
    chart:     '../js/chart'
  },
  shim: {
  }
});

// globals

var CITIES = [
  'San Francisco',
  'Bangalore',
  'Boston',
  'Geneva',
  'Rio de Janeiro',
  'Shanghai',
  'Singapore',
];

var SENSORS = [
  'temperature',
  'light',
  'airquality_raw',
  'sound,',
  'humidity',
  'dust',
];

var DAYS = 28;
var HOURS = 24;

define(['jquery', 'chart'], function ($, Chart) {

  var chart = new Chart($('.chart'));

  var data = genData();
  console.log("data", data);

  function genData(){
    var data = {};

    var valueScale = new d3.scale.linear().range([0, 100]);

    CITIES.forEach(function(cityName) {
      var city = data[cityName] = {};
      SENSORS.forEach(function(sensorName) {
        var sensor = city[sensorName] = generateRandomTimeSeries(valueScale, DAYS * HOURS);
      });
    });

    return data;
  }

  function generateRandomTimeSeries(valueScale, sampleCount, volitility) {
    volitility = volitility || .1;
    var volitilityScale = d3.scale.linear().range([-volitility, volitility]);
    var timeSeries = [];
    var normalValue = Math.random();

    // create samples

    for (var i = 0; i < sampleCount; ++i) {

      // compute value normal

      var dNormal = volitilityScale(Math.random());
      normalValue += dNormal;
      normalValue = d3.max([0, d3.min([1, normalValue])]);

      // create record

      timeSeries.push(valueScale(normalValue));
    }

    return timeSeries;
  }
});
