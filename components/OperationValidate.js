import Component, { fail } from 'noflo-assembly';

export class OperationValidate extends Component {
  constructor() {
    super({
      description: 'Gets Operation from request and validates it',
      validates: ['req', 'req.user.id'],
    });
  }
  relay(msg, output) {
    const errs = [];
    if (!msg.req.body.amount ||
      msg.req.body.amount.toString().search(/^-?\d+(\.\d+)?$/) === -1) {
      const e = new Error('Valid amount is required');
      e.field = 'amount';
      errs.push(e);
    }
    if (['USD', 'EUR'].indexOf(msg.req.body.currency) === -1) {
      const e = new Error('Currency must be USD or EUR');
      e.field = 'currency';
      errs.push(e);
    }
    if (errs.length > 0) {
      msg.req.res.status(422);
      output.sendDone(fail(msg, errs));
      return;
    }
    const op = {
      user_id: msg.req.user.id,
      amount: parseFloat(msg.req.body.amount),
      currency: msg.req.body.currency,
      description: msg.req.body.description,
    };
    if (msg.req.params && msg.req.params.id > 0) {
      op.updated_at = new Date();
    } else {
      op.created_at = new Date();
    }
    msg.operation = op;
    output.sendDone(msg);
  }
}

export function getComponent() {
  return new OperationValidate();
}
