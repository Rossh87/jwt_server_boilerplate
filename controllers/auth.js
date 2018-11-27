const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const tokenForUser = user => {
	return jwt.sign({ sub: user.id }, JWT_SECRET);
}

exports.signup = (req, res, next) => {
	const { email, password } = req.body;

	User.findOne({ email: email }, (err, existingUser) => {
		if(err) {return next(err);}

		if(existingUser) {
			return res.status(422).send({ error: 'email is in use' });
		}

		if(!email || !password) {
			return res.status(422).send({ error: 'Username and Password required' });
		}

		const user = new User({
			email,
			password
		});

		user.save((err) => {
			if(err) { return next(err); }

			res.json( {token: tokenForUser(user) });
		});
	});
};

exports.signin = (req, res, next) => {
	res.send({ token: tokenForUser(req.user) });
};