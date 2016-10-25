const d3 = require('d3');
class LinkLab {
  constructor(data, root) {
    this.data = data;
    this.links = data;
    this._root = root;

    this.color = d3.scaleOrdinal(d3.schemeCategory20);
  }


  draw() {
    this.links = this._root.selectAll('.link').data(this.links).enter()
      .append('path')
      .attr('class', 'link')
      .style('stroke', d => this.color(d.source.group))
      .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      });
  }

  get() {
    return this.links;
  }


  changeStep(nodesIds) {
    this.links = this.data
      .filter((d, i) => (nodesIds.indexOf(d.source.id) + 1) && (nodesIds.indexOf(d.target.id) + 1));
  }

  getOriginals() {
    return this.data;
  }

}


module.exports = LinkLab;
