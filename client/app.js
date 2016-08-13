'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');
const b = require('./features/feature1/feature1');

angular
  .module('myApp', [ngRoute, 'templates'])
  .config($routeProvider => {
    $routeProvider.when('/view1', {
      controller:'myController',
      templateUrl: 'features/feature1/main.tpl.html'
    })
    .otherwise({
      redirectTo: '/view1'
    });
  })
  .controller('mainCtrl', ['$templateCache', ($templateCache, $route) => {
    window.rr = $route;
    window.a = $templateCache;
  }])
  .controller('myController', ['$templateCache', b]);

