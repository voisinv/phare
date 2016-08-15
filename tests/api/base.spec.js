var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('', function() {
  it('should get 400 when wrong endpoint', function(done) {
    request('localhost:3000')
      .get('/wrond/endpoint')
      .expect(404)
      .end(done);
  });
  it('should get 400 when base but no project', function(done) {
    request('localhost:3000')
      .get('/api/articles?base=bdd-dev')
      .expect(400)
      .end(done);
  });
  it('should get articles from bdd', function(done) {
    request('localhost:3000')
      .get('/api/articles?base=bdd-dev&projet=projet1')
      .expect(200)
      .end(function(err, res) {
        res.body.links[200].source.should.be.equal(115);
        res.body.links[200].target.should.be.equal(133);
        res.body.links[200].value.should.be.equal(3);
        res.body.links.length.should.be.equal(4510);

        res.body.tags.length.should.be.equal(461);
        res.body.tags[200].value.should.be.equal('hédonisme');
        res.body.tags[200].id.should.be.equal(200);
        res.body.tags[200].group.should.be.equal(80);

        done();
      });
  });
  it('should get 400 when wrong database', function(done) {
    request('localhost:3000')
      .get('/api/articles?base=wrong')
      .expect(400)
      .end(done);
  });
  it('should get list of available base', function(done) {
    request('localhost:3000')
      .get('/api/get/all')
      .expect(200)
      .end(function(err, res) {
        res.body.length.should.be.equal(3);
        res.body[0].should.be.equal('bdd-dev');
        done();
      });
  });
})
;