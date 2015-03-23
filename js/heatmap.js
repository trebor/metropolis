define(["d3", "jquery"], function(d3, $) {return function(gSelection) {

  var X_AXIS_CORRECT = 5;
  var Y_AXIS_CORRECT_X = 12;
  var Y_AXIS_CORRECT_Y = -8;
  var valueAccess = null;
  var width = null;
  var height = null;
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal();
  var yTimeScale = d3.time.scale();
  var xAxis = d3.svg.axis().scale(x).orient('top').tickFormat(xFormat);
  var yAxis = d3.svg.axis()
    .scale(yTimeScale)
    .tickPadding(10)
    .orient('left').tickFormat(yFormat);
  var colorFn = null;
  var margin = {top: 40, bottom: 5, left: 35, right: 10};
  var cells = null;
  var cellsEnter = null;
  var data = null;
  var timeFormat = d3.time.format('%H:%M');
  var dateFormat = d3.time.format('%e %b');

  var xAxisG = gSelection
    .append('g')
    .classed('x', true)
    .classed('axis', true);

  var yAxisG = gSelection
    .append('g')
    .classed('y', true)
    .classed('axis', true);

  function xFormat(d) {
    return timeFormat(data[d].date);
  }

  function yFormat(d) {
    return dateFormat(d);
  }

  function setData(_data, columns, idAccess) {

    idAccess = idAccess || function(d, i) {return i;};

    data = _data.map(function(d, i) {
      return $.extend({x: i % columns, y: Math.floor(i / columns)}, d);
    });

    var dates = data
      .filter(function(d, i) {return i % columns == 0;})
      .map(function(d) {return normalizeDate(d.date);});
    yAxis.tickValues(dates);

    x.domain(d3.range(d3.max(data, function(d) {return d.x;}) + 1));
    y.domain(d3.range(d3.max(data, function(d) {return d.y;}) + 1));
    yTimeScale.domain([normalizeDate(data[0].date), normalizeDate(data[data.length - 1].date)]);

    cells = gSelection.selectAll('rect.cell').data(data, idAccess);

    cellsEnter = cells
      .enter()
      .append('rect')
      .classed('cell', true)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', 'white');

    cells
      .exit()
      .transition()
      .duration(TRANSITION_DURATION)
      .attr('x', function(d) {return x(d.x) + x.rangeBand() / 2;})
      .attr('y', function(d) {return y(d.y) + y.rangeBand() / 2;})
      .attr('width', 0)
      .attr('height', 0)
      .remove();

    visualize();

    return this;
  }

  function normalizeDate(date) {
    return new Date(date.getYear() + 1900, date.getMonth(), date.getDate());
  }

  function dayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function color(_colorFn) {
    colorFn = _colorFn;
    return this;
  }

  function visualize(_width, _height) {
    if (!_width || !_height || !cells) {return;}
    width  = _width  - (margin.left + margin.right );
    height = _height - (margin.top  + margin.bottom);
    x.rangeBands([margin.left, width + margin.left], 0.02);
    y.rangeBands([height + margin.top, margin.top], 0.1);
    yTimeScale.range([height + margin.top, margin.top]);

    cellsEnter
      .attr('x', function(d) {return x(d.x) + x.rangeBand() / 2;})
      .attr('y', function(d) {return y(d.y) + y.rangeBand() / 2;});

    cells
      .transition()
      .duration(TRANSITION_DURATION)
      .attr('x', function(d) {return x(d.x);})
      .attr('y', function(d) {return y(d.y);})
      .attr('width', function(d) {return x.rangeBand();})
      .attr('height', function(d) {return y.rangeBand();})
      .attr('fill', colorFn);

    xAxisG
      .transition()
      .duration(TRANSITION_DURATION)
      .attr('transform', 'translate(0,' + (margin.top + X_AXIS_CORRECT) + ')')
      .call(xAxis);

    yAxisG
      .transition()
      .duration(TRANSITION_DURATION)
      .attr('transform', 'translate(' + (margin.left + Y_AXIS_CORRECT_X) + ', ' + Y_AXIS_CORRECT_Y + ')')
      .call(yAxis);

  }

  var exports = {
    setData: setData,
    color: color,
    visualize: visualize
  };

  return $.extend(exports, {});
};});
