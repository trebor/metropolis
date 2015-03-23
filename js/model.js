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

var SENSOR_DETAILS = {
  'light':          {title: 'Light',       unit: '㏓'       },
  'temperature':    {title: 'Temperature', unit: '℃'       },
  'airquality_raw': {title: 'Air Quality', unit: 'mV'       },
  'sound':          {title: 'Sound',       unit: 'dB'       },
  'humidity':       {title: 'Humidity',    unit: '%'        },
  'dust':           {title: 'Dust',        unit: 'pcs/238mL'}
};

var FRAME_DELAY = 5000;
var TRANSITION_DURATION = 2500;
// var FRAME_DELAY = 100;
// var TRANSITION_DURATION = 100;

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
