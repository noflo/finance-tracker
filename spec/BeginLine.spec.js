const { expect } require('chai');
const { asCallback, IP } = require('noflo');
const { v4 } = require('uuid');

describe('StartLine component', () => {
  let wrapper;
  before((done) => {
    wrapper = asCallback('finance-tracker/BeginLine');
    done();
  });

  it('creates an assembly message', (done) => {
    const id = v4();
    const req = { msg: 'This is a mock request' };
    const ip = new IP('data', req, { scope: id });

    wrapper(ip, (err, result) => {
      if (err) { done(err); return; }
      expect(result).to.be.an('object');
      expect(result.errors).to.have.lengthOf(0);
      expect(result.id).to.equal(id);
      expect(result.req).to.equal(req);
      done();
    });
  });
});
