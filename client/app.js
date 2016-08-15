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
        redirectTo: '/view1'
      });
  })
  .controller('mainCtrl', ['$templateCache', ($templateCache, $route) => {
    window.rr = $route;
    window.a = $templateCache;
  }])
  .controller('myController', angular.noop)
  .component('myComponent', {
    template: '<div id=\'graph\'></div>',
    controller: require('./features/dataviz/graph.js'),
    bindings: {
      graph: '='
    }
  })
  .controller('datavizCtrl', require('./features/dataviz/dataviz'));


