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
  retrieve: (query, res) => {
    access.getAll(query.base, query.project).then((r) => {
      res.status(200).send(r);
    }, (err) => {
      res.status(400).send(err);
    });
  }
};