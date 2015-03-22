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
  'light',
  'temperature',
  'airquality_raw',
  'sound',
  'humidity',
  'dust',
];

var SENSOR_TITLE = {
  'light': 'Light',
  'temperature': 'Temperature',
  'airquality_raw': 'Air Quality',
  'sound': 'Sound',
  'humidity': 'Humidity',
  'dust': 'Dust'
};

var FRAME_DELAY = 5000;
var TRANSITION_DURATION = 2500;

// define data model module

define(['d3'], function(d3) {return function() {

  var model = null;
  var dimentions = null;

  var dispatcher = d3.dispatch(['data']);

  d3.csv('data/all_data.csv', gotData)
    .row(function(d) {
      SENSORS.forEach(function(sensorName) {
        d[sensorName] = +d[sensorName];
      });
      d.date = new Date(d.measurement_timestamp);
      return d;
    });

  function gotData(data) {
    dispatcher.data(data);
  }

  function query(city, type, start, days) {
  }

  var exports = {
    query: query
  };

  return $.extend(exports, dispatcher);
};});
