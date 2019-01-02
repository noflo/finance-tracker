const Component = require('noflo-assembly');
const db = require('../lib/db');

class BeginLine extends Component {
  constructor() {
    super({
      description: 'Starts assembly line for request',
      inPorts: {
        in: {
          datatype: 'object',
          description: 'Express.js Request',
        },
      },
      outPorts: {
        out: {
          datatype: 'object',
          description: 'Assembly',
        },
      },
    });
  }

  handle(input, output) {
    const req = input.getData('in');
    const msg = {
      errors: [],
      id: input.scope, // scope is a request UUID
      req,
    };
    // Start a database transaction
    db.transaction((trx) => {
      msg.db = trx;
      output.sendDone(msg);
      // The transaction must be committed or rolled back explicitly
      // at the end of the line
      return null;
    }).catch((e) => {
      if (e.message !== 'NO_ERROR') {
        console.error('BeginLine catch:', e);
      }
    });
  }
}

exports.getComponent = () => new BeginLine();
