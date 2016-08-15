// const _ = require('lodash');
const dialogController = [
  '$scope', '$http', '$mdDialog',
  function($scope, $http, $mdDialog) {
    const self = this;
    self.step = 5;
    self.loadDatabases = () => {
      $http.get('/api/get/all')
        .then(({data}) => self.databases = data);
    };
    self.loadProjects = () => {
      $http.get('/api/get/' + self.database.toLowerCase())
        .then(({data}) => self.projects = data);
    };
    $scope.$watch(() => self.database, () => {
      self.projects = [];
      self.project = null;
    });

    self.visualize = () => {
      $mdDialog.hide({
        base: self.database,
        project: self.project
      });
    };
  }
];
const $ = require('jquery');
module.exports = ['$scope', '$http', '$mdDialog', '$mdMedia', function($scope, $http, $mdDialog, $mdMedia) {
  const self = this;
  self.configure = (ev) => {
    const useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
    $mdDialog.show({
      controller: dialogController,
      controllerAs: 'dialogDataviz',
      templateUrl: 'features/dataviz/dialog.dataviz.tpl.html',
      parent: $(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: useFullScreen
    })
      .then(obj => {
        self.isReady = false;
        return $http.get('/api/articles?base=' +  obj.base + '&projet=' + obj.project);
      })
      .then(({data}) => {
        console.log(data);
        self.graphData = data;
        self.isReady = true;
      });
  };
}];


