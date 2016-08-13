var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('', function() {
  it('test', function(done) {
    request('localhost:3000')
      .get('/api/articles')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.should.have.property('_id');
        done();
      });
  });
})
;