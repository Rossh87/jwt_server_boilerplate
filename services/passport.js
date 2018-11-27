const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWT_SECRET = process.env.JWT_SECRET;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = {
	usernameField: 'email'
}
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// Verify email and pw, call done() if verification succeeds
	// Otherwise, call done() with false
	User.findOne({ email }, (err, user) => {
		if(err){
			return done(err);
		}

		if(!user){
			return done(null, false);
		}

		// Compare password with user pw in database
		user.comparePasswords(password, done);
	});
});

// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: JWT_SECRET
};

// Create Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// check for decoded user id in database
	// if user id, call done() with that user object
	// if not, call done() w/out user object

	User.findById(payload.sub, (err, user) => {
		if(err){
			return done(err, false) ;
		}

		if(user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

// Implement Strategy
passport.use(jwtLogin);
passport.use(localLogin);