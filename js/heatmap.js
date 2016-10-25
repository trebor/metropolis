define(["d3", "jquery"], function(d3, $) {return function(gSelection, options) {

  // globals

  var width = null;
  var height = null;
  var cells = null;
  var cellsEnter = null;
  var data = null;
  var colorFn = null;
  var columns = null;

  // pre initialized globals

  options = options || {};

  var titleFormat = function(d) {return d ? d.toString() : '';};
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal();
  var xSpaceing = options.xSpaceing || 0.02;
  var ySpaceing = options.ySpaceing || 0.1;
  var xAxisCorrectX = 0;
  var xAxisCorrectY = 5;
  var yAxisCorrectX = 12;
  var yAxisCorrectY = 0;
  var xAxis = null;
  var yAxis = null;

  var margin = options.margin || {top: 37, bottom: 10, left: 45, right: 15};

  var xAxisG = gSelection
    .append('g')
    .attr('transform', 'translate(0, 0)')
    .classed('x', true)
    .classed('axis', true);

  var yAxisG = gSelection
    .append('g')
    .attr('transform', 'translate(0, 0)')
    .classed('y', true)
    .classed('axis', true);

  function indexToX(i) {
    return i % columns;
  }
  function indexToY(i) {
    return Math.floor(i / columns);
  }

  function setData(data, _columns, idAccess, _xAxis, _yAxis) {
    columns = _columns;
    xAxis = _xAxis;
    yAxis = _yAxis;

    var xValues = d3.range(indexToX(columns- 1) + 1);
    var yValues = d3.range(indexToY(data.length - 1) + 1);
    x.domain(xValues);
    y.domain(yValues);

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

    // cellsEnter.append('title')
    //   .html(titleFormat);

    cells
      .exit()
      // .transition()
      // .duration(TRANSITION_DURATION)
      // .attr('y', function(d, i) {return y(indexToY(i)) + y.rangeBand();})
      // .attr('height', 0)
      .remove();

    return this;
  }

  function unbug(selection) {
    // console.log("selection.length", selection[0].length);
    // console.log("selection", selection);
  }

  function color(_colorFn) {
    colorFn = _colorFn;
    return this;
  }

  function visualize(_width, _height) {
    if (!_width || !_height || !cells) {return;}

    if (width != _width) {
      width  = _width  - (margin.left + margin.right );
      x.rangeBands([margin.left, margin.left + width], xSpaceing);
    }

    if (height != _height) {
      height = _height - (margin.top  + margin.bottom);
      y.rangeBands([margin.top  + height, margin.top], ySpaceing);
    }

    var xBand = x.rangeBand();
    var yBand = y.rangeBand();

    // cellsEnter
    //   .attr('x', function(d, i) {return x(indexToX(i));})
    //   .attr('y', function(d, i) {return y(indexToY(i));})
    //   .attr('width', function(d) {return xBand;})
    //   .attr('height', 0);

    cells
      // .transition()
      // .duration(TRANSITION_DURATION)
      .attr('x', function(d, i) {return x(indexToX(i));})
      .attr('y', function(d, i) {return y(indexToY(i));})
      .attr('width', function(d) {return xBand;})
      .attr('height', function(d) {return yBand;})
      .attr('fill', colorFn);

    // if (xAxis) {
    //   xAxis.scale().rangeBands([margin.left, margin.left + width], xSpaceing);
    //   xAxisG
    //     // .transition()
    //     // .duration(TRANSITION_DURATION)
    //     .attr('transform', 'translate(' + [xAxisCorrectX, margin.top + xAxisCorrectY] + ')')
    //     .call(xAxis);
    // }

    // if (yAxis) {
    //   yAxis.scale().rangeBands([margin.top  + height, margin.top], ySpaceing);

    //   yAxisG
    //     // .transition()
    //     // .duration(TRANSITION_DURATION)
    //     .attr('transform',
    //           'translate(' + [margin.left + yAxisCorrectX, yAxisCorrectY] + ')')
    //     .call(yAxis);
    // }
  }

  function setTitleFormat(_titleFormat) {
    titleFormat = _titleFormat;
    return this;
  }

  var exports = {
    setData: setData,
    setTitleFormat: setTitleFormat,
    color: color,
    visualize: visualize
  };

  return $.extend(exports, {});
};});
