const d3 = require('d3');

const NodeLab = require('./NodeLab.js');
const LinkLab = require('./LinkLab.js');

class DataFrame {
  constructor() {
    this._width = 1260;
    this._height = 1000;

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.svg;
    this.initialize();
  }

  initialize() {
    this.svg = d3.select('.visualize-svg')
      .append('svg')
      .attr('width', this._width)
      .attr('height', this._height)
      //.attr('display', 'block')
      //.style('margin', 'auto')
      .style('border', '1px solid black');
      //.call(d3.zoom()
        //.scaleExtent([1 / 2, 8])
        //.on('zoom', this.zoomed));
  }


}

class DataClass extends DataFrame {
  constructor(data) {
    super();
    this.nodeLab = new NodeLab(data.tags, this.svg);
    this.linkLab = new LinkLab(data.links, this.svg);
  }

  simulate() {
    this.simulation = d3.forceSimulation(this.nodeLab.getOriginals())
      .force('charge', d3.forceManyBody().strength(-150))
      .force('link', d3.forceLink(this.linkLab.getOriginals()))
      .force('collide', d3.forceCollide().radius(d => (5 * d.weight) + 0.5))
      .force('x', d3.forceX(this._width / 2))
      .force('y', d3.forceY(this._height / 2));

    for (var i = 100; i > 0; --i) this.simulation.tick();

    this.simulation.stop();
    return this;
  }

  drawNodes() {
    this.nodeLab.draw();
    return this;
  }

  drawLinks() {
    this.linkLab.draw();
    return this;
  }

  changeStep(val) {
    this._step = val;
    const nodes = this.nodeLab.changeStep(val).get();
    const nodesIds = nodes.map(n => n.id);
    this.linkLab.changeStep(nodesIds);
    return this;
  }
  reset() {
    this.svg.selectAll('*').remove();

    return this;
  }

  draw() {
    this
      .reset()
      .simulate()
      .drawLinks()
      .drawNodes();
    return this;
  }


}

module.exports = DataClass;
