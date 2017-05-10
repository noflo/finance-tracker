import 'mocha';
import { expect } from 'chai';
import { asCallback } from 'noflo';
import { v4 } from 'uuid';
import { mockRequest, cleanUp } from './lib/helpers';
import db from '../lib/db';

describe('OperationsCreate graph', () => {
  let wrapper;
  const userData = {
    id: v4(),
    name: 'John',
    token: v4(),
    currency: 'USD',
  };
  before((done) => {
    wrapper = asCallback('finance-tracker/OperationsCreate');
    cleanUp(db)
    .then(() => db('users').insert(userData))
    .then(() => done())
    .catch(done);
  });
  after((done) => {
    cleanUp(db)
    .then(() => done())
    .catch(done);
  });

  it('fails with 422 if input is invalid', (done) => {
    const req = mockRequest(null, (code, json) => {
      expect(code).to.equal(422);
      expect(json.errors).to.have.lengthOf(2);
    });
    req.body = {
      amount: 'zaksdj',
      currency: '',
    };
    req.user = {
      id: '12312412512',
    };
    wrapper(req, (err, res) => {
      if (err) { done(err); return; }
      expect(res).to.equal(req.res);
      done();
    });
  });

  it('creates an operation with 201', (done) => {
    const req = mockRequest(null, (code, json) => {
      try {
        expect(code).to.equal(201);
        expect(json.id).to.be.ok;
      } catch (e) {
        done(e);
      }
    });
    req.body = {
      amount: 100,
      currency: 'USD',
    };
    req.user = userData;
    wrapper(req, (err, res) => {
      if (err) { done(err); return; }
      expect(res).to.equal(req.res);
      done();
    });
  });
});
