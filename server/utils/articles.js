const access = require('../connect/firebase-connect.js');
const aggregate = require('./aggregate');


module.exports = {
  get: (query, res) => {
    access.get(query.base, query.projet).then((data) => {
      res.json(aggregate.toDataviz(data));
    }, (err) => {
      res.status(400).send(err);
    });
  },

  tags: (query, res) => {
    access.get(query.base, query.projet).then((data) => {
      res.json(aggregate.articles(data, query.value));
    }, (err) => {
      res.status(400).send(err);
    });
  },

  retrieve: (query, res) => {
    // myFirebase
    // .base(base)
    // .project(project)
    // .then(res => res.status(200).send('ok'));

    access.getAll(query.base, query.project).then((r) => {
      res.status(200).send(r);
    }, (err) => {
      res.status(400).send(err);
    });
  }
};
