import { v4 } from 'uuid';

export function mockRequest(statusCode, callback) {
  return {
    res: {
      statusCode,
      status(code) {
        this.statusCode = code;
      },
      json(obj) {
        if (typeof callback === 'function') {
          callback(this.statusCode, obj);
        }
      },
    },
  };
}

export function mockMsg(req, result, errors = []) {
  return {
    errors,
    id: v4(),
    req,
    result,
  };
}

export function cleanUp(db) {
  return db.raw(`TRUNCATE TABLE
    users,
    operations,
    tags,
    operations_tags
    CASCADE`);
}
