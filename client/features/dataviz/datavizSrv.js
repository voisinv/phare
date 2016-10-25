const d3 = require('d3');

const _ = require('lodash');

//const c10 = d3.scale.category10();
//const scale = d3.scale
/*
var zoom = d3.zoom()
  .scaleExtent([1, 100])
  .on('zoom', function() {
    lastTransformation = d3.event.transform;
    hideNodes
      .attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
    nodes
      .attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
    links
      .attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
  })*/

let datalab;
function createSVG(data) {

  datalab = new Datalab(data);
  datalab
    .simulate()
    .draw();
}

let CURRENT_NODE_INDEX;
document.addEventListener('click', function() {
  nodeClicked(null, CURRENT_NODE_INDEX);
});
function nodeClicked(e, index) {
  event.stopPropagation();
  if (CURRENT_NODE_INDEX === -1 && _.isUndefined(index)) {
    return;
  }
  if (index === CURRENT_NODE_INDEX) {
    //reset();
    CURRENT_NODE_INDEX = -1;
    return;
  }

  CURRENT_NODE_INDEX = index;
  let indexOfNodes = [];
  hideNodes.attr('opacity', 1);
  getLinksToModify()
    .style('opacity', 0.1)
    .style('stroke-width', 0.3)
    .filter(d => d.source.id === index || d.target.id === index)
    .style('opacity', 1)
    .style('stroke-width', 2)
    .each(d => {
      indexOfNodes.push(d.source.id);
      indexOfNodes.push(d.target.id);
    });

  nodes
    .style('opacity', (d, i) => (indexOfNodes.indexOf(i) + 1) ? 1 : 0.3);


  displayName(SHOW_ALL_LABEL);

  nodeSelectedCbFn(e.value);
}

// MUST be nodes object
function showLabel(d) {
  d3.select(this).style('opacity', 1);
  const circle = d3.select(this);

  d3.select(this.parentNode.parentNode)
    .append('text')
    .attr('fill', 'black')
    .attr('x', (d.x - (d.weight * 5)))
    .attr('y', (d.y - (d.weight * 5)) - 5)
    .attr('dx', function() {
      var elem = this;
      setTimeout(() =>
        d3.select(elem)
          .transition()
          .attr('dx', ((d.weight * 10) - elem.getBBox().width) / 2)
      );
      return 0;
    })
    .attr('transform', lastTransformation)
    //.attr('transform', 'translate(' + lastTransformation.x + ',' + lastTransformation.y + ')' )

    .text(_.capitalize(d.value));
}

function reset() {}

function filter(step) {
  datalab
    .reset()
    .configure({step: step})
    .draw();
}
let SHOW_ALL_LABEL = false;
function displayName(shouldDisplay) {
  datalab
    .reset()
    .configure({labelsOn: shouldDisplay})
    .draw();
}
function getLinksToModify() {
  return links
    .filter(function() {
      return d3.select(this).style('opacity') != 0;
    });
}

function changeWidth(val) {
  links.style('stroke-width', val);
}

function ticked() {
  //links
  //  .attr('x1', (d) => d.source.x)
  //  .attr('y1', (d) => d.source.y)
  //  .attr('x2', (d) => d.target.x)
  //  .attr('y2', (d) => d.target.y);
  nodes
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

}

let nodeSelectedCbFn;

class DatalabPosition {
  constructor(data) {
    this._width = 1260;
    this._height = 1000;

    this.nodes = [];
    this.links = [];

    this.simulation = [];
    this.circleGroup = [];

    this.color = d3.scaleOrdinal(d3.schemeCategory20);
    this.svg;
    this.lastTransformation = {x: 0, y: 0, k:0};

    this.__step = 1;
    this.__labelsOn = false;

    this.data = data;
  }

  zoomed() {
    this.lastTransformation = d3.event.transform;
    this.circleGroup.attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
    this.links.attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
    d3.selectAll('text').attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
  }

  appendNode(root, opacity) {

    const hidedNode = root
      .append('circle')
      .attr('fill', 'white')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5);

    const node = root
      .append('circle')
      .attr('class', 'circle')
      .attr('class', 'node')
      .style('opacity', opacity)
      .attr('fill', d => this.color(d.group))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5)
      .on('mouseenter', this.mouseEnter.bind(this))
      .on('mouseleave', this.removeLabel.bind(this))
      // put circle on top of svg
      .each(function() {
        d3.select(this.parentNode).raise();
      })
      .on('click', this.nodeClicked);

    this.hideNodes.push(hidedNode);
    this.nodes.push(node);
  }

  appendNodesSelection(root, selection, opacity) {
    const elem = root
      .selectAll('.circle')
      .data(selection)
      .enter()
      .append('g')
      .attr('class', 'nodeGroup')
      .each(function(d) {
        if (false) {
          this.appendNode(this, 0.3);
        }
        else {
          this.appendNode(this, 0.9);
        }
      });

    return this;
  }

  getTopTags() {

  }
  getDownTags() {

  }

  getTopLinks() {

  }
  getDownLinks() {

  }

  getTopLabels() {

  }
  getDownLabels() {

  }
}


class Datalab extends DatalabPosition {
  constructor(data) {
    super(data);
    this.data = data;

    this.nodes = this.data.tags;
    this.links = this.data.links;

    this.svg = d3.select('.visualize-svg')
      .append('svg')
      .attr('width', this._width)
      .attr('height', this._height)
      //.attr('display', 'block')
      //.style('margin', 'auto')
      .style('border', '1px solid black')
      .call(d3.zoom()
        .scaleExtent([1 / 2, 8])
        .on('zoom', this.zoomed));
  }

  simulate() {
    this.simulation = d3.forceSimulation(this.nodes)
      .force('charge', d3.forceManyBody().strength(-150))
      .force('link', d3.forceLink(this.links))
      .force('collide', d3.forceCollide().radius(d => (5 * d.weight) + 0.5))
      .force('x', d3.forceX(this._width / 2))
      .force('y', d3.forceY(this._height / 2));

    for (var i = 100; i > 0; --i) this.simulation.tick();

    this.simulation.stop();
    return this;
  }

  draw() {
    this
      .drawLinks()
      .drawNodes();

    if (this.__labelsOn) {
      this.drawLabels();
    }
    return this;
  }

  configure(config = {}) {

    this.__step = config.step || this.__step;
    this.__labelsOn = _.isUndefined(config.labelsOn) ? this.__labelsOn : config.labelsOn;

    this.nodes = this.data.tags.filter(e => e.weight >= this.__step);
    const indexOfNodes = this.nodes.map(n => n.id);
    this.links = this.data.links
      .filter((d, i) => (indexOfNodes.indexOf(d.source.id) + 1) && (indexOfNodes.indexOf(d.target.id) + 1));
    return this;
  }

  reset() {
    this.svg.selectAll('*').remove();

    return this;
  }

  /*drawNodes() {
    this.circleGroup = this.svg.selectAll('.circle').data(this.nodes).enter().append('g').attr('class', 'nodeGroup');

    this.hideNodes = this.circleGroup
      .append('circle')
      .attr('fill', 'white')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5);

    this.nodes = this.circleGroup
      .append('circle')
      .attr('class', 'circle')
      .attr('class', 'node')
      .attr('fill', d => this.color(d.group))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5)
      .on('mouseenter', this.mouseEnter.bind(this))
      .on('mouseleave', this.removeLabel.bind(this))
      // put circle on top of svg
      .each(function() {
        d3.select(this.parentNode).raise();
      })
      .on('click', this.nodeClicked);
    return this;
  }*/

  nodeClicked(d) {

  }

  drawLabels() {
    this.nodes
      .each(this.displayLabel.bind(this));
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

  removeLabel() {
    this.svg.select('text').remove();
  }

  drawLinks() {
    this.links = this.svg.selectAll('.link').data(this.links).enter()
      .append('path')
      .attr('class', 'link')
      .style('stroke', d => this.color(d.source.group))
      .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      });
    return this;
  }


}

module.exports = ['$http', function($http) {
  function init() {
    //$http.get('/mock').then(res => {
    //  console.log(res.data);
    //  createSVG(res.data);
    //});

  }

  return {
    init,
    filter,
    displayName,
    changeWidth,
    reset,
    nodeSelectedCb : fn => nodeSelectedCbFn = fn,
    setData: function(data) {
      createSVG(data);
    }
  };
}];
