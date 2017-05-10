import 'mocha';
import { expect } from 'chai';
import { asCallback } from 'noflo';
import { mockMsg, mockRequest } from './lib/helpers';

describe('SendResponse component', () => {
  let wrapper;
  before((done) => {
    wrapper = asCallback('finance-tracker/SendResponse');
    done();
  });

  it('sends result as JSON on success', (done) => {
    const result = {
      foo: 'Bar',
    };
    const req = mockRequest(200, (code, json) => {
      expect(json).to.deep.equal(result);
    });
    const msg = mockMsg(req, result);

    wrapper(msg, (err, res) => {
      if (err) { done(err); return; }
      expect(res).to.equal(req.res);
      done();
    });
  });

  it('sends errors as JSON on failure', (done) => {
    const err0 = new Error('Something went wrong');
    const err1 = new Error('Validation failed');
    err1.field = 'user_name';
    const errors = [err0, err1];
    const result = {
      errors: [
        { message: err0.message },
        { message: err1.message, field: err1.field },
      ],
    };
    const req = mockRequest(200, (code, json) => {
      expect(code).to.equal(500);
      expect(json).to.deep.equal(result);
    });
    const msg = mockMsg(req, undefined, errors);

    wrapper(msg, (err, res) => {
      if (err) { done(err); return; }
      expect(res).to.equal(req.res);
      done();
    });
  });
});
