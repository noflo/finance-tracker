const { v4 } = require('uuid');

exports.mockRequest = (statusCode, callback) => {
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
};

exports.mockMsg(req, result, errors = []) => {
  return {
    errors,
    id: v4(),
    req,
    result,
  };
};

exports.cleanUp(db) => {
  return db.raw(`TRUNCATE TABLE
    users,
    operations,
    tags,
    operations_tags
    CASCADE`);
};
