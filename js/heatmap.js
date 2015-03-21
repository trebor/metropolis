define(["d3", "jquery"], function(d3, $) {return function(gSelection) {

  var valueAccess = null;
  var width = null;
  var height = null;
  var x = d3.scale.ordinal();
  var y = d3.scale.ordinal();
  var colorFn = null;
  var margin = {top: 5, right: 0, bottom: 0, left: 0};

  function setData(data, idAccess, _valueAccess) {
    valueAccess = _valueAccess || function(d) {return d;};
    idAccess = idAccess || function(d, i) {return i;};

    x.domain(d3.range(data[0].length));
    y.domain(d3.range(data.length));

    var updateCols = gSelection
      .selectAll('g.row')
      .data(data, idAccess);

    updateCols
      .enter()
      .append('g')
      .classed('row', true)
      .each(function(d) {
        d3.select(this).selectAll('rect.box')
          .data(d)
          .enter()
          .append('rect')
          .classed('box', true)
          .attr('fill', 'white');

      });

    updateCols
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
    width = _width - (margin.left + margin.right);
    height = _height  - (margin.top + margin.bottom);
    if (!width || !height) {return;}
    x.rangeRoundBands([margin.left, width] , 0.1, 0);
    y.rangeRoundBands([margin.top, height], 0.1, 0);

    gSelection.selectAll('g.row')
      .attr('transform', function(d, i) {
        var pos = [0, y(i)];
        return 'translate(' + pos + ')';
      }).each(function() {
        var boxes = d3.select(this).selectAll('.box')
          .attr('x', function(d, i) {return x(i);})
          .attr('width', function(d) {return x.rangeBand();})
          .attr('height', function(d) {return y.rangeBand();});

        if (colorFn) {
          boxes
            .transition()
            .duration(2500)
            .attr('fill', colorFn);
        }
      });
  }

  var exports = {
    setData: setData,
    color: color,
    visualize: visualize
  };

  return $.extend(exports, {});
};});
