const Component = require('noflo-assembly');

const { fail } = Component;

class OperationCheck extends Component {
  constructor() {
    super({
      description: 'Checks operation ID, ownership and updated feilds',
      validates: ['req', 'req.user.id'],
    });
  }
  relay(msg, output) {
    if (!msg.req.params || !msg.req.params.id) {
      msg.req.res.status(400);
      output.sendDone(fail(msg, new Error('Operation ID is required')));
      return;
    }
    let sent = false;
    msg.db('operations')
      .select()
      .where('id', msg.req.params.id)
      .then((rows) => {
        if (sent) { return; }
        sent = true;
        if (rows.length !== 1) {
          msg.req.res.status(404);
          output.sendDone(fail(msg, new Error('Operation not found')));
          return;
        }
        if (rows[0].user_id !== msg.req.user.id) {
          msg.req.res.status(403);
          output.sendDone(fail(msg, new Error('Operation owned by another user')));
          return;
        }
        const op = rows[0];
        if (msg.operation.description === undefined && op.description) {
          msg.operation.description = op.description;
        }
        msg.operation.id = parseInt(op.id, 10);
        output.sendDone(msg);
      })
      .catch((e) => {
        if (sent) {
          console.error(e);
        } else {
          sent = true;
          output.sendDone(fail(msg, e));
        }
      });
  }
}

exports.getComponent = () => new OperationCheck();
