'strict mode';
const _ = require('lodash');
const jLouvain = require('./jlouvain');

function getIndex(value) {
  const length = this.length;
  for (var index = 0; index < length; index++) {
    if (this[index].value == value) return index;
  }
}

var getLinkWithWeight = function(tags, allTags, links) {
  'use strict';
  for (var fIt = 0; fIt < tags.length; fIt++) {
    for (var sIt = fIt + 1; sIt < tags.length; sIt++) {
      let idSource = getIndex.call(allTags, tags[fIt]);
      let idTarget = getIndex.call(allTags, tags[sIt]);
      let link = _.find(links, {source: idSource, target: idTarget});
      // If link already exist
      if (link) {
        link.value += 1;
      } else {
        links.push({
          source: idSource,
          target: idTarget,
          value: 3
        });
      }
    }
  }
};

const createLinks = function(result) {
  var obj = {
    links: [],
    articles: _.values(result.articles),
    tags: _.values(result.tags)
  };

  obj.articles.forEach(function(article) {
    if (article.tags && article.tags.length) {
      getLinkWithWeight(article.tags, obj.tags, obj.links);
    }
  });
  return obj;
};

module.exports = {
  toDataviz: (data) => {
    // data splitted by link and tags
    const mapped = createLinks(data);
    mapped.tags.forEach((e, i) => e.id = i);

    mapped.links = mapped.links.filter((e) => e.source && e.target);
    const community = jLouvain().nodes(_.map(mapped.tags, 'id')).edges(mapped.links)();
    // console.log(community);
    mapped.tags.forEach((elem, i) => {
      elem.group = community[i];
      elem.size = elem.weight;
    });
    return mapped;
  }
};