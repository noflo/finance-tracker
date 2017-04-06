import Component from 'noflo-assembly';

export class StartLine extends Component {
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
    output.sendDone(msg);
  }
}

export function getComponent() {
  return new StartLine();
}
