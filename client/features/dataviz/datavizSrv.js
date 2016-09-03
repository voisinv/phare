const d3 = require('d3');

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const width = 1260;
const height = 1000;
const _ = require('lodash');

//const c10 = d3.scale.category10();
const color = d3.scaleOrdinal(d3.schemeCategory20);
let simulation;
let nodes;
let links;

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
    for (var i = 100; i > 0; --i) simulation.tick();
    simulation.stop();
    const circleEnter = svg.selectAll('.circle').data(data.tags).enter().append('g');

    links = svg.selectAll('.link').data(data.links).enter()
      .append('line')
      .attr('class', 'link')
      .attr('opacity', 0.2)
      .attr('stroke-width', d => d.value)
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nodes = circleEnter
      .append('circle')
      .attr('class', 'circle')
      .attr('class', 'node')
      .attr('fill', d => color(d.group))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5)
      .on('mouseenter', showValue)
      .on('mouseleave', hideValue)
      // put circle on top of svg
      .each(function() {
        d3.select(this.parentNode).raise();
      });
  });
}

function showValue(d) {
  d3.select(this.parentNode)
    .append('text')
    .attr('fill', 'black')
    .attr('x', (d.x - (d.weight * 5)))
    .attr('y', (d.y - (d.weight * 5)) - 5)
    .attr('dx', function() {
      var elem = this;
      setTimeout(() =>
        d3.select(elem)
          .attr('dx', ((d.weight * 10) - elem.getBBox().width)/2));
      return 0;
    })
    .text(_.capitalize(d.value));
}

function hideValue(d) {
  d3.select(this.parentNode.lastChild)
    .transition()
    .attr('opacity', 0)
    .transition()
    .remove();
}

function filter(step) {
  nodes
    .attr('opacity', d => d.weight >= step ? 1 : 0);

  links
    .attr('opacity', d => d.source.weight >= step && d.target.weight >= step ? 0.6 : 0);
}

function displayName(shouldDisplay) {
  if (shouldDisplay) {
    d3.selectAll('.node').each(showValue);
  }
  else {
    d3.selectAll('.node').each(hideValue);
  }
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
    displayName
  };
}];
