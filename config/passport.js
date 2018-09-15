const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      collection = DB.collection("users");
      collection
        .findOne({ id: jwt_payload.id }) // this is is from the db
        .then(user => {
          if (user) {
            return done(null, user); //done() from passport
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
