// const _ = require('lodash');
module.exports = ['$scope', '$http', function($scope, $http) {
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
}];