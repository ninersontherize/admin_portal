const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      keys.pool.query('SELECT id, email, password, permissions FROM app.user WHERE id=$1', [jwt_payload.id], (err, result) => {
        if(result.rows.length > 0) {
          return done(null, { id: first.id, username: first.email, permissions: first.permissions });
        } else {
          return done(null, false);
        }
      });
    })
  );
};