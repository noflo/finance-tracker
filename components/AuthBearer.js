import Component from 'noflo-assembly';
import * as passport from 'passport';
import { BearerStrategy } from 'passport-http-bearer';
import * as knex from 'knex';

export class AuthBearer extends Component {
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

export function getComponent() {
  return new AuthBearer();
}
