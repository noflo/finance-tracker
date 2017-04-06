import Component from 'noflo-assembly';
import * as bodyParser from 'body-parser';

// Sets up auxilliary middleware for our application
class Middleware extends Component {
  constructor() {
    super({
      description: 'Application-specific Express.js middleware',
    });
  }
  handle(input, output) {
    const app = input.get('in');
    app.use(bodyParser.json({
      type: 'application/json',
      limit: '2mb',
    }));
    output.sendDone(app);
  }
}
