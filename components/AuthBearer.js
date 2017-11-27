const Component = require('noflo-assembly');
const passport = require('passport');
const { BearerStrategy } = require('passport-http-bearer');
const knex = require('knex');

class AuthBearer extends Component {
  handle(input, output) {
    const app = input.getData('in');
    app.use(passport.initialize());
    passport.use(new BearerStrategy((token, done) => {
      knex('users')
        .select()
        .where('token', token)
        .then((rows) => {
          if (rows.length !== 1) {
            done(null, false);
            return;
          }
          done(null, rows[0]);
        })
        .catch(done);
    }));
    output.sendDone(app);
  }
}

exports.getComponent = () => new AuthBearer();
