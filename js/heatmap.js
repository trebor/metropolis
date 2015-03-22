define(["d3", "jquery"], function(d3, $) {return function(gSelection) {

  var valueAccess = null;
  var width = null;
  var height = null;
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal();
  var colorFn = null;
  var margin = {top: 5, right: 0, bottom: 0, left: 0};
  var cells = null;

  function setData(data, columns, idAccess, _valueAccess) {
    valueAccess = _valueAccess || function(d) {return d;};
    idAccess = idAccess || function(d, i) {return i;};

    data = data.map(function(d, i) {
      return $.extend({x: i % columns, y: i / columns}, d);
    });

    x.domain(d3.range(columns));
    y.domain(d3.range(data.length / columns));

    cells = gSelection.selectAll('rect.cell').data(data, idAccess);

    cells
      .enter()
      .append('rect')
      .classed('cell', true)
      .attr('fill', 'white');

    cells
      .exit()
      .remove();

    visualize();

    return this;
  }

  function color(_colorFn) {
    colorFn = _colorFn;
    return this;
  }

  function visualize(_width, _height) {
    if (!_width || !_height || !cells) {return;}
    width = _width - (margin.left + margin.right);
    height = _height  - (margin.top + margin.bottom);
    x.rangeRoundBands([margin.left, width] , 0.1, 0);
    y.rangeRoundBands([margin.top, height], 0.1, 0);

    cells
      .attr('x', function(d) {return x(d.x);})
      .attr('y', function(d) {return y(d.y);})
      .attr('width', function(d) {return x.rangeBand();})
      .attr('height', function(d) {return y.rangeBand();});

    if (colorFn) {
      cells
        .transition()
        .duration(2500)
        .attr('fill', colorFn);
    }
  }

  var exports = {
    setData: setData,
    color: color,
    visualize: visualize
  };

  return $.extend(exports, {});
};});
