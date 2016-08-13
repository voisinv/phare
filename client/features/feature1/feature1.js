'use strict';
const fn = function($templateCache) {
  this.text = 'Hello worldd';
  window.tpl = $templateCache;
};

module.exports = fn;
