const Component = require('noflo-assembly');

const { fail } = Component;

class OperationSaveResult extends Component {
  constructor() {
    super({
      description: 'Checks Insert/Update result',
      validates: { operation: 'obj' },
    });
  }
  relay(msg, output) {
    if (msg.rowset.length === 1) {
      if (msg.operation.id === undefined) {
        msg.operation.id = msg.rowset.shift();
        msg.req.res.status(201);
      }
      msg.result = msg.operation;
    } else {
      fail(msg, new Error('Could not save operation'));
    }
    delete msg.rowset;
    output.sendDone(msg);
  }
}

exports.getComponent = () => new OperationSaveResult();
