'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');
// require('angular-material/angular-material.css');
angular
  .module('myApp', [
    require('angular-material'),
    ngRoute, 'templates'])
  .config(($routeProvider, $mdThemingProvider) => {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .backgroundPalette('grey')
      .warnPalette('red')
      .accentPalette('pink');
    $routeProvider.when('/view1', {
      controller: 'myController',
      templateUrl: 'features/feature1/main.tpl.html'
    })
      .when('/dataviz', {
        controller: 'datavizCtrl',
        controllerAs: 'dataviz',
        templateUrl: 'features/dataviz/dataviz.tpl.html'
      })
      .otherwise({
        redirectTo: '/dataviz'
      });
  })
  .controller('mainCtrl', ['$templateCache', ($templateCache, $route) => {
    window.rr = $route;
    window.a = $templateCache;
  }])
  .controller('myController', angular.noop)
  .component('myComponent', {
    templateUrl: 'features/dataviz/graph.tpl.html',
    controller: require('./features/dataviz/graph.js'),
    controllerAs: 'graph',
    bindings: {
      graph: '='
    }
  })
  .service('datavizSrv', require('./features/dataviz/datavizSrv.js'))
  .controller('datavizCtrl', require('./features/dataviz/dataviz.js'));


