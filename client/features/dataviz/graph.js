const DataClass = require('./DatalabClass.js');

module.exports = function($scope, datavizSrv, $http, $window) {

  const self = this;
  self.step = 1;

  //datavizSrv.init();

  $scope.$watch(() => self.step, (val, old) => {
    //if (val !== old) datavizSrv.filter(val);
    if (val !== old) Datalab.changeStep(val).draw();
  });

  $scope.$watch(() => self.displayName, (val, old) => {
    if (val !== old) datavizSrv.displayName(val);
  });
  $scope.$watch(() => self.width, (val, old) => {
    if (val !== old) datavizSrv.changeWidth(val);
  });

  self.reset = () => datavizSrv.reset();
  let Datalab;

  $http.get('/mock')
    .then(({data}) => {
      //datavizSrv.setData(data);
      Datalab = new DataClass(data);
      Datalab
        .draw();

    });

    datavizSrv.nodeSelectedCb(function(val) {
    $http.get('/api/tags?base=bdd-dev&projet=projet1&value=' + val)
      .then(res => {
        self.articles = res.data;
      })
      .catch(err => console.error(err));
  });

};
