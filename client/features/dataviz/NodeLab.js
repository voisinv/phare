const d3 = require('d3');
class NodeLab {
  constructor(data, root) {
    this.data = data;
    this.nodes = data;
    this._root = root;

    this.color = d3.scaleOrdinal(d3.schemeCategory20);
  }

  drawCircle() {
    this.nodes = this._root.selectAll('.nodeGroup')
      .data(this.nodes).enter()
      .append('g')
      .attr('class', 'nodeGroup');

    this.hideNodes = this.nodes
      .append('circle')
      .attr('fill', 'white')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5);

    this.circles = this.nodes
      .append('circle')
      .attr('class', 'circle')
      .attr('class', 'node')
      .attr('fill', d => this.color(d.group))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5)
      //.on('mouseenter', this.mouseEnter.bind(this))
      //.on('mouseleave', this.removeLabel.bind(this))
      // put circle on top of svg
      .each(function() {
        d3.select(this.parentNode).raise();
      })
      //.on('click', this.nodeClicked);
    return this;
  }

  drawLabels() {
    return this;
  }

  get() {
    return this.nodes;
  }

  getOriginals() {
    return this.data;
  }

  draw() {
    this
      .drawCircle()
      .drawLabels();
  }

  changeStep(val) {
    this.nodes = this.data.filter(e => e.weight >= val);
    return this;
  }

  mouseEnter(d) {
    this.displayLabel.call(this, d);
  }

  displayLabel(d) {
    this.svg
      .append('text')
      .attr('fill', 'black')
      .attr('x', (d.x - (d.weight * 5)))
      .attr('y', (d.y - (d.weight * 5)) - 5)
      .attr('dx', function() {
        const elem = this;
        setTimeout(() =>
          d3.select(elem)
            .transition()
            .attr('dx', ((d.weight * 10) - elem.getBBox().width) / 2)
        );
        return 0;
      })
      //.attr('transform', lastTransformation)
      //.attr('transform', 'translate(' + lastTransformation.x + ',' + lastTransformation.y + ')' )

      .text(_.capitalize(d.value));
  }


}


module.exports = NodeLab;
