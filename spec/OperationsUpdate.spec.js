const { expect } require('chai');
const { asCallback } = require('noflo');
const { v4 } = require('uuid');
const { mockRequest, cleanUp } require('./lib/helpers');
const db = require('../lib/db');

describe('OperationsUpdate graph', () => {
  let wrapper;
  const userData = {
    id: v4(),
    name: 'John',
    token: v4(),
    currency: 'USD',
  };
  const opData = {
    user_id: userData.id,
    amount: 100,
    currency: 'USD',
  };
  before((done) => {
    wrapper = asCallback('finance-tracker/OperationsUpdate');
    cleanUp(db)
      .then(() => db('users').insert(userData))
      .then(() => db('operations').insert(opData, 'id'))
      .then((rows) => {
        opData.id = rows.shift();
        done();
      })
      .catch(done);
  });
  after((done) => {
    cleanUp(db)
      .then(() => done())
      .catch(done);
  });

  it('fails with 404 if operation does not exist', (done) => {
    const req = mockRequest(null, (code, json) => {
      try {
        expect(code).to.equal(404);
        expect(json.errors).to.have.lengthOf(1);
        done();
      } catch (e) {
        console.log(json.errors);
        done(e);
      }
    });
    req.body = {
      amount: 101,
      currency: 'USD',
    };
    req.user = {
      id: '12312412512',
    };
    req.params = {
      id: 99999999,
    };
    wrapper(req, (err, res) => {
      if (err) { done(err); return; }
      expect(res).to.equal(req.res);
    });
  });

  it('updates an operation with 200', (done) => {
    const req = mockRequest(200, (code, json) => {
      try {
        expect(code).to.equal(200);
        expect(json.id).to.be.ok;
        expect(json.description).to.equal('TopUp');
        done();
      } catch (e) {
        console.log(json.errors);
        done(e);
      }
    });
    req.body = {
      amount: 101,
      currency: 'USD',
      description: 'TopUp',
    };
    req.user = userData;
    req.params = {
      id: opData.id,
    };
    wrapper(req, (err, res) => {
      if (err) { done(err); return; }
      expect(res).to.equal(req.res);
    });
  });
});
