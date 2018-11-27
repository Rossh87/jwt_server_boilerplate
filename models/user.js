const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
	email: {
		type:String,
		unique: true,
		lowercase: true
	},
	password: String
});

// On save hook, encrypt password
userSchema.pre('save', function(next) {
	const user = this;
	bcrypt.hash(user.password, 10, (err, hash) => {
		if(err) {return next(err)}

		user.password = hash;
		next();
	});
});

// Add pw verification method to all instances of User
userSchema.methods.comparePasswords = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if(err) {
			return cb(err);
		} 

		return isMatch ?
				cb(null, this)
				: cb(null, false);
	});
};

const User = mongoose.model('User', userSchema);

module.exports = User;