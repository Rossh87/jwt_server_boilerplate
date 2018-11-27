const Authentication = require('./controllers/auth');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
	app.get('/', (req, res) => {
		res.send({ msg: 'hi' })
	});

	app.post('/signin', requireSignin, Authentication.signin)

	app.post('/signup', Authentication.signup);
}