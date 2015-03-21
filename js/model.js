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
  // 'temperature',
  // 'light',
  'airquality_raw',
  // 'sound,',
  // 'humidity',
  // 'dust',
];

var DAYS = 7;
var HOURS = 24;

// define data model module

define(['d3', 'crossfilter'], function(d3, _cs) {return function() {

  var model = null;
  var dimentions = null;

  var dispatcher = d3.dispatch(['data']);

  d3.csv('data/small_data.txt', gotData)
    .row(function(d) {
      SENSORS.forEach(function(sensorName) {
        d[sensorName] = +d[sensorName];
      });
      d.date = new Date(d.timestamp);
      return d;
    });

  function gotData(data) {
    // model = crossfilter(data);

    // dimentions = {};
    // SENSORS.forEach(function(sensorName) {
    //   dimentions[sensorName] = model.dimension(function(d) {return d[sensorName];});
    // });

    // console.log("dimentions.airquality_raw.filter()", dimentions.airquality_raw.filter());
    // console.log("model()", model.size());

    dispatcher.data(data);
  }

  function query(city, type, start, days) {
  }

  var exports = {
    query: query
  };

  return $.extend(exports, dispatcher);
};});
