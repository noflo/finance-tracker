const Component = require('noflo-assembly');

class OperationSaveCommand extends Component {
  constructor() {
    super({
      description: 'Prepares Insert/Update command',
      validates: { operation: 'obj' },
    });
  }
  relay(msg, output) {
    msg.query = {
      table: 'operations',
      data: msg.operation,
      returning: 'id',
    };
    if (msg.operation.id > 0) {
      msg.query.where = { id: msg.operation.id };
    }
    output.sendDone(msg);
  }
}

exports.getComponent = () => new OperationSaveCommand();
