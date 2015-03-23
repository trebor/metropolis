define(["d3", "jquery"], function(d3, $) {return function(gSelection) {

  var X_AXIS_CORRECT = 5;
  var Y_AXIS_CORRECT = 5;

  var valueAccess = null;
  var width = null;
  var height = null;
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal();
  var yTimeScale = d3.time.scale();
  var xAxis = d3.svg.axis().scale(x).orient('top').tickFormat(xFormat);
  var yAxis = d3.svg.axis()
    .scale(yTimeScale)
    .tickValues([new Date(), new Date(), new Date()])
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

    console.log("_data.length", _data.length);
    data = _data.map(function(d, i) {
      return $.extend({x: i % columns, y: Math.floor(i / columns)}, d);
    });

    console.log("data.length", data.length);

    x.domain(d3.range(d3.max(data, function(d) {return d.x;}) + 1));
    y.domain(d3.range(d3.max(data, function(d) {return d.y;}) + 1));
    yTimeScale.domain([normalizeDate(data[0].date), normalizeDate(data[data.length - 1].date)]);

    // yTimeScale.domain(d3.extent(_data, function(d) {
    //   // var date = d.date;
    //   // return new Date(date.getYear() + 1900, date.getMonth(), date.getDate());
    //   return d.date;
    // }))

    var extent1 = d3.extent(_data, function(d) {return d.date;});
    var extent2 = yTimeScale.domain();
    console.log("extent days 1:", dayOfYear(extent1[1]) - dayOfYear(extent1[0]));
    console.log("extent days 2:", dayOfYear(extent2[1]) - dayOfYear(extent2[0]));

    // console.log("yTimeScale.domain()", yTimeScale.domain());

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
    y.rangeBands([margin.top, height + margin.top], 0.1);
    yTimeScale.range([margin.top, height + margin.top], 0.1);

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
      .attr('transform', 'translate(' + (margin.left + Y_AXIS_CORRECT) + ', 0)')
      .call(yAxis);

  }

  var exports = {
    setData: setData,
    color: color,
    visualize: visualize
  };

  return $.extend(exports, {});
};});
