/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', done => {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {
    let deletedId;

    suite('POST /api/books with title => create book object/expect book object', () => {

      test('Test POST /api/books with title', done => {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Emma' })
          .end((err, res) => {
            deletedId = res.body._id;
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Emma');
            done();
          });
      });

      test('Test POST /api/books with no title given', done => {
        chai.request(server)
          .post('/api/books')
          .send({ title: '' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', () => {

      test('Test GET /api/books', done => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {

      test('Test GET /api/books/[id] with id not in db', done => {
        chai
          .request(server)
          .get('/api/books/111')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', done => {
        chai
          .request(server)
          .get('/api/books/' + deletedId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Emma');
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {

      test('Test POST /api/books/[id] with comment', done => {
        chai
          .request(server)
          .post('/api/books/' + deletedId)
          .send({ comment: 'great book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.comments[0], 'great book');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', done => {
        chai
          .request(server)
          .post('/api/books/' + deletedId)
          .send({ comment: '' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', done => {
        chai
          .request(server)
          .get('/api/books/111')
          .send({ comment: 'great book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('Test DELETE /api/books/[id] with valid id in db', done => {
        chai
          .request(server)
          .delete('/api/books/' + deletedId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', done => {
        chai
          .request(server)
          .delete('/api/books/111')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
  });
});

after(() => {
  chai.request(server)
    .get('/');
});