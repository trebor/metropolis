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
  'sound':          {title: 'Sound',       unit: 'mV'       },
  'humidity':       {title: 'Humidity',    unit: '%'        },
  'dust':           {title: 'Dust',        unit: 'pcs/238mL'}
};

var CITY_DETAILS = {
	'San Francisco':      {format: yFormatEn,     tz: -8  },
	'Boston':             {format: yFormatEn,     tz: -5  },
	'Rio de Janeiro':     {format: yFormatPtBr,   tz: -3  },
	'Genève':             {format: yFormatFr,     tz:  1  },
	'ಬೆಂಗಳೂರು':            {format: yFormatKan,    tz:  5.5},
	'Republik Singapura': {format: yFormatMs,     tz:  7  },
	'上海市':              {format: yFormatZhHans, tz:  8  }
};

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

var MS_INA_SECOND = 1000;
var MS_INA_MINUTE = MS_INA_SECOND * 60;
var MS_INA_HOUR   = MS_INA_MINUTE * 60;
var MS_INA_DAY    = MS_INA_HOUR   * 24;

var FRAME_DELAY = 5000;
var TRANSITION_DURATION = 2500;
// var FRAME_DELAY = 500;
// var TRANSITION_DURATION = 0;

// define data model module

define(['jquery', 'd3'], function($, d3) {return function() {

  var model = null;
  var dateExtent = null;
  var nextNullId = -1;

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

    model = d3.nest()
      .key(function(d) { return d.city_name; })
      .key(function(d) { return normalizeDate(d.date); })
      .rollup(function(d) {
        var date = normalizeDate(d[0].date);
        return d.reduce(function(acc, current) {
          acc[current.date.getHours()] = current;
          return acc;
        }, createNullDay(date));
      })
      .map(data);

    dateExtent = d3.extent(data, function(d) {return d.date;}).map(normalizeDate);
    dispatcher.data(data);
  }

  function normalizeDate(date) {
    return new Date(date.getYear() + 1900, date.getMonth(), date.getDate());
  }

  function oneDay(cityName, date) {
    var city = model[cityName];
    var day = city ? (city[date] || createNullDay(date)) : createNullDay(date);
    return day.map(function(d) {d.id = d.date.getTime(); return d;});
  }

  function oneWeek(cityName, date) {
    var startTime = date.getTime();
    return d3.range(7).reduce(function(acc, current) {
      return acc.concat(oneDay(cityName, new Date(startTime + current * MS_INA_DAY)));
    }, []);
  }

  function createNullDay(date) {
    var startTime = date.getTime();
    return d3.range(24).map(function(d, i) {
      return {date: new Date(startTime + i * MS_INA_HOUR)};
    });
  }

  function minDate() {
    return dateExtent[0];
  }

  function maxDate() {
    return dateExtent[1];
  }

  var exports = {
    oneDay: oneDay,
    oneWeek: oneWeek,
    minDate: minDate,
    maxDate: maxDate
  };

  return $.extend(exports, dispatcher);
};});
