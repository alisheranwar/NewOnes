import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import config from '../Config/config';
import crypto from 'crypto';

const userSchmea = new mongoose.Schema(
	{
		name: { type: String, required: [true, 'Please Enter yout Name'] },
		email: {
			type: String,
			unique: true,
			required: [true, 'Please Enter yout Email'],
			validate: [validator.isEmail, 'Please Enter you Valid Email'],
			index: true,
		},
		password: {
			type: String,
			required: [true, 'Please Enter yout Password'],
			minLength: [8, 'Password must b greater then 8 Charcters'],
			select: false,
		},
		role: {
			type: String,
			default: 'user',
		},

		resetPasswordToken: String,
		resetPasswordExpire: String,
	},
	{
		timestamps: true,
	}
);

userSchmea.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

// CREATING A TOKEN
userSchmea.methods.getJwtToken = function () {
	return Jwt.sign({ id: this._id }, config.JWT_SECRET, {
		expiresIn: config.JWT_EXPIRES,
	});
};

// COMPAREING A PASSWORD

userSchmea.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// GENRATING A PASSWORD TOKEN

userSchmea.methods.getResetPasswordToken = function () {
	// Generating a token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hashing and adding resetPassswordToken to userSchmea

	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

	return resetToken;
};

const userModel = mongoose.model('Users', userSchmea);

export default userModel;
