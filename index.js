var d3 = require('d3');

function d2r (degrees) {
    return (degrees * Math.PI) / 180;
}

function radarChart (el, data, _arg) {
    if (!(this instanceof radarChart)) return new radarChart(el, data, _arg);

    var d3el = d3.select(el),
        size = _arg.size || 400,
        that = this;

    this.size = size;
    this.radius = size/2;
    this.sections = _arg.sections || 4;
    this.layerThickness = this.radius/this.sections;
    this.data = data;
    this.sliceNum = this.data.length;
    this.sliceAngle = 360/this.sliceNum;

    var valRange = d3.extent(this.data, function (d) { return d.value; });

    //scales
    var sectionScale = d3
        .scale
        .linear()
        .domain(valRange)
        .rangeRound([1, this.sections]);

    this.opacityScale = d3
        .scale
        .linear()
        .domain([0, this.sections - 1])
        .range([0.4, 1]);

    this.data.forEach(function (d, i) {
      d.sections = [];
      var sectionNum = sectionScale(d.value);
      for (var ii = 0; ii < that.sections; ii++) {
        var active = true;
        if(ii >= sectionNum) { active = false; }
        d.sections[ii] = { value: i, active: active, color: d.color };
      }
    });

    var arc = d3.svg.arc()
      .outerRadius(function(d, i) {
          return ((i+1)/that.sections) * that.radius;
      })
      .innerRadius(function(d, i) { return (i/that.sections) * that.radius; })
      .startAngle(function(d) { return d2r(d.value * that.sliceAngle); })
      .endAngle(function(d) { return d2r((d.value + 1) * that.sliceAngle); });

    d3el.style('width', size + 'px').style('height', size + 'px');
    this.svg = d3el.append('svg')
      .attr('class', 'radar-chart')
      .attr('width', size)
      .attr('height', size);

    this.slices = this.svg.selectAll('g')
      .data(this.data)
      .enter()
      .append('g')
      .on('mouseover', function(d) { that.mouseoverSlice(d); })
      .on('mouseout', function(d) { that.mouseoutSlice(d); });

    this.sections = this.slices.selectAll('path')
      .data(function(d) {return d.sections; })
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d) {
          if (d.active) {
              return d.color;
          } else {
              return '#f9f9f9';
          }
      })
      .attr('opacity', function(d, i) { return that.opacityScale(i); })
      .attr('stroke', '#f0f0f0')
      .attr('stroke-width', 2)
      .attr('transform', 'translate(' + this.radius + ',' + this.radius + ')')
      .attr('cursor', 'pointer');

    this.tooltip = d3el.append('div')
      .attr('class', 'diy-tooltip btn-tooltip');
}

radarChart.prototype.mouseoverSlice = function(slice) {
    var that = this;
    var sliceEl = this.svg.selectAll('g').filter(function(d) { return d === slice; });
    sliceEl.selectAll('path').transition()
      .duration(60)
      .attr('opacity', 1);
    var mouseLoc = d3.mouse(this.svg.node());
    this.tooltip
      .html(function(){ return slice.html; })
      .style('bottom', (that.size - mouseLoc[1]) + 'px').style('left', mouseLoc[0] + 'px')
      .classed('on', true);
};

radarChart.prototype.mouseoutSlice = function(slice) {
    var that = this;
    var sliceEl = this.svg.selectAll('g').filter(function(d) { return d === slice; });
    sliceEl.selectAll('path').transition()
      .attr('opacity', function(d, i) { return that.opacityScale(i);});
    this.tooltip.classed('on', false);
};

module.exports = radarChart;
