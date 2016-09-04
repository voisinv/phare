const d3 = require('d3');

const width = 1260;
const height = 1000;
const _ = require('lodash');

//const c10 = d3.scale.category10();
const color = d3.scaleOrdinal(d3.schemeCategory20);
let simulation;
let nodes;
let links;
let circleGroup;
//const scale = d3.scale

function createSVG(data) {
  const svg = d3.select('.visualize-svg')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('display', 'block')
    .style('margin', 'auto')
    .style('border', '1px solid black');


  setTimeout(() => {
    simulation = d3.forceSimulation(data.tags)
      .force('charge', d3.forceManyBody().strength(-150))
      .force('link', d3.forceLink(data.links))
      .force("collide", d3.forceCollide().radius(d => d.r + 0.5))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
    //.on('tick', ticked);

    const n = 100;
    for (var i = 500; i > 0; --i) simulation.tick();
    simulation.stop();
    circleGroup = svg.selectAll('.circle').data(data.tags).enter().append('g');

    links = svg.selectAll('.link').data(data.links).enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke', d => color(d.source.group))
      //.style('stroke-width', d => d.source.weight > 1 && d.target.weight > 1 ? (d.source.weight + d.target.weight) / 3 : 0)
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nodes = circleGroup
      .append('circle')
      .attr('class', 'circle')
      .attr('class', 'node')
      .attr('fill', d => color(d.group))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5)
      .on('mouseenter', showLabel)
      .on('mouseleave', hideLabel)
      // put circle on top of svg
      .each(function() {
        d3.select(this.parentNode).raise();
      })
      .on('click', nodeClicked);
    circleGroup
      .append('text')
      .attr('fill', 'black')
      .style('opacity', 0)
      .attr('x', d => (d.x - (d.weight * 5)))
      .attr('y', d => (d.y - (d.weight * 5)) - 5)
      .attr('dx', function(d) {
        var elem = this;
        setTimeout(() =>
          d3.select(elem)
            .attr('dx', ((d.weight * 10) - elem.getBBox().width) / 2));
        return 0;
      })
      .text(d => _.capitalize(d.value));
  });
}
let CURRENT_NODE_INDEX;
function nodeClicked(e, index) {
  if (index === CURRENT_NODE_INDEX) {
    reset();
    CURRENT_NODE_INDEX = -1;
    return;
  }
  CURRENT_NODE_INDEX = index;
  let indexOfNodes = [];
  links
    .style('opacity', 0.1)
    .style('stroke-width', 0.3)
    .filter(d => d.source.id === index || d.target.id === index)
    .style('opacity', 1)
    .style('stroke-width', 2)
    .each(d => {
      indexOfNodes.push(d.source.id);
      indexOfNodes.push(d.target.id);
    });

  circleGroup
    .style('opacity', 0.3)
    .filter((d, i) => indexOfNodes.indexOf(i) + 1)
    .style('opacity', 1);
}

function showLabel() {
  d3.select(this.parentNode.lastChild)
    .style('opacity', 1);
}

function hideLabel() {
  if (SHOW_ALL_LABEL) return;
  d3.select(this.parentNode.lastChild)
    .transition().style('opacity', 0);
}

function filter(step) {
  circleGroup
    .attr('opacity', d => d.weight >= step ? 1 : 0);

  links
    .attr('opacity', d => d.source.weight >= step && d.target.weight >= step ? 0.6 : 0);
}
let SHOW_ALL_LABEL = false;
function displayName(shouldDisplay) {
  SHOW_ALL_LABEL = shouldDisplay;
  if (shouldDisplay) {
    nodes.each(function() {
      showLabel.call(this)
    });
  }
  else {
    nodes.each(function() {
      hideLabel.call(this)
    });
  }
}

function changeWidth(val) {
  links.style('stroke-width', val)
}

function reset() {
  circleGroup.style('opacity', 1);
  links
    .style('stroke-width', 0.5)
    .style('opacity', 0.5);
}

function ticked() {
  //links
  //  .attr("x1", (d) => d.source.x)
  //  .attr("y1", (d) => d.source.y)
  //  .attr("x2", (d) => d.target.x)
  //  .attr("y2", (d) => d.target.y);
  nodes
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

}
module.exports = ['$http', function($http) {
  function init() {
    $http.get('/mock').then(res => {
      console.log(res.data);
      createSVG(res.data);
    });
  }

  return {
    init,
    filter,
    displayName,
    changeWidth,
    reset
  };
}];
