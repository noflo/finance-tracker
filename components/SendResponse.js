import Component from 'noflo-assembly';

export class SendResponse extends Component {
  constructor() {
    super({
      description: 'Finishes assembly line by sending a response to client',
      inPorts: {
        in: {
          datatype: 'object',
          description: 'Assembly',
        },
      },
      outPorts: {
        out: {
          datatype: 'object',
          description: 'Express.js Response (sent)',
        },
      },
      validates: ['req', 'req.res', 'result'],
    });
  }
  handle(input, output) {
    const msg = input.getData('in');
    if (!this.validate(msg)) {
      // Log errors and extract public data for response
      const errors = [];
      msg.errors.forEach((e) => {
        if (msg.req.res.statusCode !== 422) {
          // Don't log validation errors
          console.error(e);
        }
        const err = { message: e.message };
        if (e.field) { err.field = e.field; }
        errors.push(err);
      });
      // Set statusCode to 500 if not set to error already
      if (msg.req.res.statusCode < 400) {
        msg.req.res.statusCode = 500;
      }
      // Rollback the database transaction
      if (msg.db) {
        try {
          msg.db.rollback(new Error('NO_ERROR'));
        } catch (e) {
          // This shit always fails, ignore it
          console.log('IGNORE', e);
        }
      }
      // Send JSON error response
      msg.req.res.json({ errors });
    } else {
      // Commit the database transaction
      if (msg.db) {
        msg.db.commit();
      }
      msg.req.res.json(msg.result);
    }
    output.sendDone(msg.req.res);
  }
}

export function getComponent() {
  return new SendResponse();
}
