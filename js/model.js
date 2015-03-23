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


//var dateFormat = d3.time.format('erik %e %b');
//var dateFormat_alt = d3.time.format('robert %e %b');

function yFormatEn(d) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];  
  return d.getDate()+' '+months[d.getMonth()];
}
function yFormatPtBr(d) {
  var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];  
  return d.getDate()+' de '+months[d.getMonth()];
}
function yFormatFr(d) {
  var months = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  //var months = ['Jän', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'];  
  return d.getDate()+' '+months[d.getMonth()];
}
function yFormatKan(d) {
  var months = ['ಛ', 'ಪತ', 'ಭ಺', 'ಏ', 'ಮೆೀ', 'ಛೊ', 'ಛು', 'ಆ', 'ಷತ', 'ಅ', 'ಧ', 'ಡಿ'];  
  return d.getDate()+' '+months[d.getMonth()];
}
function yFormatZhHans(d) {
  return (d.getMonth()+1)+'月 '+d.getDate()+'日';
}
function yFormatMs(d) {
  var months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];  
  return d.getDate()+' '+months[d.getMonth()];
}

var DATE_MAP = {
	  'San Francisco': yFormatEn,
	  'Boston': yFormatEn,
	  'Rio de Janeiro': yFormatPtBr,
	  'Genève': yFormatFr,
	  'ಬೆಂಗಳೂರು': yFormatKan,
	  'Republik Singapura': yFormatMs,
	  '上海市': yFormatZhHans
  };

//kannada ex: 18 ಛ
// January ಛ
// February ಪತ
// March ಭ಺
// April ಏ
// May ಮೆೀ
// June ಛೊ
//July ಛು
// August ಆ
// Sep ಷತ
// October ಅ
//November ಧ
//December ಡಿ

//Simplified Chinese
//1月 1日
//2月
//3月
//4月
//5月
//6月
//7月
//8月
//9月
//10月
//11月
//12月

//Brazil
//1o de maio


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
