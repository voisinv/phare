const d3 = require('d3');

const width = 1260;
const height = 1000;
const _ = require('lodash');

//const c10 = d3.scale.category10();
const color = d3.scaleOrdinal(d3.schemeCategory20);
let simulation;
let hideNodes;
let nodes = [];
let links = [];
let circleGroup;
//const scale = d3.scale
let svg;
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
  });
function zoomed() {
  lastTransformation = d3.event.transform;
  circleGroup.attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
  links.attr('transform', 'translate(' + (d3.event.transform.x) + ',' + (d3.event.transform.y) + ') scale(' + (d3.event.transform.k) + ')');
}
let lastTransformation = {x: 0, y: 0, k:0};

let bilinks = [];
function createSVG(data) {
  svg = d3.select('.visualize-svg')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    //.attr('display', 'block')
    //.style('margin', 'auto')
    .style('border', '1px solid black')
    /*.call(d3.zoom()
      .scaleExtent([1 / 2, 8])
      .on('zoom', zoomed));*/
    //.call(zoom);

  setTimeout(() => {
    simulation = d3.forceSimulation(data.tags)
      .force('charge', d3.forceManyBody().strength(-150))
      .force('link', d3.forceLink(data.links))
      .force('collide', d3.forceCollide().radius(d => (5 * d.weight) + 0.5))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2));


    //.on('tick', ticked);

    simulation
      .nodes(data.tags);

    for (var i = 10; i > 0; --i) simulation.tick();

    simulation.stop();
    circleGroup = svg.selectAll('.circle').data(data.tags.filter(e => e.id)).enter().append('g');

    links = svg.selectAll('.link').data(data.links).enter()
      .append('path')
      .attr('class', 'link')
      .style('stroke', d => color(d.source.group))
      .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      });
    //.style('stroke-width', d => d.source.weight > 1 && d.target.weight > 1 ? (d.source.weight + d.target.weight) / 3 : 0)
    //.attr('x1', (d) => d.source.x)
    //.attr('y1', (d) => d.source.y)
    //.attr('x2', (d) => d.target.x)
    //.attr('y2', (d) => d.target.y);

    hideNodes = circleGroup
      .append('circle')
      .attr('fill', 'white')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5)
    ;

    nodes = circleGroup
      .append('circle')
      .attr('class', 'circle')
      .attr('class', 'node')
      .attr('fill', d => color(d.group))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.weight * 5)
      .on('mouseenter', showLabelOnMouseEnter)
      .on('mouseleave', hideLabelOnMouseLeave)
      // put circle on top of svg
      .each(function() {
        d3.select(this.parentNode).raise();
      })
      .on('click', nodeClicked)
    ;
  });
}

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
    + "S" + d[1].x + "," + d[1].y
    + " " + d[2].x + "," + d[2].y;
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
    reset();
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
          //.attr('x', (circle.attr('cx') - (d.weight * 5)))
          //.attr('y', (circle.attr('cy') - (d.weight * 5)) - 5)
          //.attr('dx', ((d.weight * 10) - elem.getBBox().width) / 2))
      );
      return 0;
    })
    //.attr('transform', lastTransformation)
    //.attr('transform', 'translate(' + lastTransformation.x + ',' + lastTransformation.y + ')' )

    .text(_.capitalize(d.value));
}

function hideLabel() {
  if (SHOW_ALL_LABEL) return;
  d3.select(this).style('opacity', 0.8);
  d3.select(this.parentNode.parentNode.lastChild)
    .transition().remove();
}

function filter(step) {
  links
    .style('opacity', d => d.source.weight >= step && d.target.weight >= step ? 0.6 : 0);
  nodes
  //.filter(shouldDisplayLabelWhenClicked)
    .each(function() {
      d3.select(this.parentNode).style('opacity', d => d.weight >= step ? 1 : 0);
    });
  displayName(SHOW_ALL_LABEL);
}
let SHOW_ALL_LABEL = false;
function displayName(shouldDisplay) {
  svg.selectAll('text').remove();
  let select;
  if (shouldDisplay && CURRENT_NODE_INDEX !== -1) {
    select = nodes.filter(shouldDisplayLabelWhenClicked);
  }
  else {
    if (shouldDisplay) {
      select = nodes.filter(shouldDisplayLabel);
    }
  }
  SHOW_ALL_LABEL = shouldDisplay;

  if (select) {
    select.each(showLabel);
  }
}
function getLinksToModify() {
  return links
    .filter(function() {
      return d3.select(this).style('opacity') != 0;
    });
}

function getNodesToModify() {
  return CURRENT_NODE_INDEX !== -1 ? nodes.filter(shouldDisplayLabelWhenClicked) : nodes.filter(shouldDisplayLabel);
}
function showLabelOnMouseEnter(d) {
  if (shouldDisplayLabelWhenClicked.call(this) && !SHOW_ALL_LABEL) {
    showLabel.call(this, d);
  }
}
function hideLabelOnMouseLeave(d) {
  if (shouldDisplayLabelWhenClicked.call(this) && !SHOW_ALL_LABEL) {
    hideLabel.call(this, d);
  }
}

function shouldDisplayLabelWhenClicked() {
  const parentOpacity = d3.select(this).style('opacity');
  return parentOpacity != 0 && parentOpacity != 0.3;
}

function shouldDisplayLabel() {
  return d3.select(this).style('opacity') != 0;
}

function changeWidth(val) {
  links.style('stroke-width', val);
}

function reset() {
  nodes.style('opacity', 0.8);
  links
    .style('stroke-width', 0.5)
    .style('opacity', 0.5);
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
    reset,
    nodeSelectedCb : fn => nodeSelectedCbFn = fn
  };
}];
