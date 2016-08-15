// const _ = require('lodash');
const Promise = require('promise');
const firebase = require('firebase');
const _ = require('lodash');

var BDD;

function retrieveBddNames(resolve) {
  if (BDD) resolve(BDD);
  var list = firebase.initializeApp({
    databaseURL: 'https://phare-users.firebaseio.com'
  }, 'list');
  list.database().ref().child('repositories').once('value').then((res) => {
    BDD = res.val();
    resolve(BDD);
  }, (err) => {
    console.error(err);
  });
}

module.exports = {
  get: (db, project) => {
    'so';
    var promise = new Promise(retrieveBddNames);
    return promise
      .then(() => {
        if (_.isUndefined(db) || _.map(_.values(BDD), e => e.name.toLowerCase()).indexOf(db.toLowerCase()) === -1) {
          throw 'It seems that the base doesn\'t exist';
        }

        const current_repo = _.find(BDD, (e) => e.name.toLowerCase() === db.toLowerCase());

        if (!current_repo.instance) {
          current_repo.instance = firebase.initializeApp({
            databaseURL: current_repo.url.toLowerCase()
          }, current_repo.name);
        }
        return current_repo.instance.database().ref().once('value');
      })
      .then((snapshot) => {
        var ref;
        if (project && snapshot.hasChild(project)) {
          ref = snapshot.child(project);
        }
        else {
          throw 'It seems that the project doesn\'t exist';
        }
        return (ref || snapshot).val();
      });
  },
  getAll: (base, project) => {
    return new Promise(retrieveBddNames)
      .then((bdd) => {
        base = base || 'all';
        if (base === 'all') return _.map(bdd, 'name');
        const current_repo = _.find(BDD, (e) => e.name.toLowerCase() === base.toLowerCase());
        if (_.isUndefined(current_repo)) {
          throw 'It seems that the base doesn\'t exist';
        }
        if (!current_repo.instance) {
          current_repo.instance = firebase.initializeApp({
            databaseURL: current_repo.url.toLowerCase()
          }, current_repo.name);
        }
        return current_repo.instance.database().ref().once('value');
      })
      .then((snapshot) => {
        if (_.isArray(snapshot)) {
          return snapshot;
        }
        return _.keys(snapshot.val());
      });
  }
};