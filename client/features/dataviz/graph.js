module.exports = function($scope, datavizSrv) {

  const self = this;
  self.step = 1;

  datavizSrv.init();

  $scope.$watch(() => self.step, (val, old) => {
    if (val !== old) {
      datavizSrv.filter(val);
    }
  });


  /*
  const width = $window.innerWidth;
  const height = $window.innerHeight;

  const color = d3.scale.category20();

  const force = d3.layout
    .force()
    .charge(-120)
    .linkDistance(function(d) {
      return d.target.group === d.source.group ? 180 : 200;
    })
    .gravity(0.2)
    .size([width, height]);


  var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, height])
    .range([height, 0]);
  var svg = d3.select('#graph').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .call(d3.behavior.zoom().scaleExtent([1, 8]).on('zoom', zoom));

  function zoom() {
    svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
  }

  var link;
  let graph = this.graph;
  graph.nodes = graph.tags;
  delete graph.tags;
  var v = 10;//_.maxBy(graph.nodes, 'weight').weight;
  var r = d3.scale.ordinal()
    .domain(d3.range(v))
    .rangeBands([0, v]);

  var stroke_opacity = d3.scale.ordinal()
    .domain(d3.range(10))
    .rangeBands([0, 1]);

  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  link = svg
    .selectAll('.link')
    .data(graph.links)
    .enter().append('line')
    .attr('class', 'link')
    .style('opacity', function(d) {
      var v = Math.random();
      return 1;
    })
    .style('stroke-width', d => d.value > 3 ? d.value / 3 : 0);

  var node = svg
    .selectAll('.node')
    .data(graph.nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', d => d.weight > 30 ? d.weight / 5 : 0)
    .style('fill', d => color(d.group))
    .call(force.drag)
    //.on('click', (d) => alert( ' '+ d.label + ' ' + d.weight))
    .attr('transform', d => 'translate(' + d + ')');

   node.append('title')
   .text(function(d) { return d.name; });

  force.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });
  */
};
