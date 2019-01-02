const Component = require('noflo-assembly');
const bodyParser = require('body-parser');

class Middleware extends Component {
  constructor() {
    super({ description: 'Application-specific Express.js middleware' });
  }

  handle(input, output) {
    const app = input.getData('in');
    app.use(bodyParser.json({
      type: 'application/json',
      limit: '2mb',
    }));
    output.sendDone(app);
  }
}

exports.getComponent = () => new Middleware();
