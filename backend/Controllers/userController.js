import CatchAsyncError from '../Middleware/CatchAsyncError';
import Users from '../Models/userModel';
import ErrorHandler from '../Utils/ErrorHandler';
import sendToken from '../Utils/sendToken';
import { sendEmail } from '../Utils/sendEmail';
import crypto from 'crypto';

// CREATING A USER
export const createUser = CatchAsyncError(async (req, res, next) => {
	const { name, email, password } = req.body;

	const user = await Users.create({
		name,
		email,
		password,
	});

	sendToken(user, 200, res);
});

// LOGIN USER

export const loginUser = CatchAsyncError(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorHandler('Please Enter Email and Passowrd', 404));
	}

	const user = await Users.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorHandler('User Not Found', 404));
	}

	const isPasswordMatched = await user.comparePassword(password);

	if (!isPasswordMatched) {
		return next(new ErrorHandler('Invalid Email or Passsowrd', 404));
	}

	sendToken(user, 200, res);
});

// LOGOUT USER

export const logoutUser = CatchAsyncError(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({ success: true, message: 'Logged Out Successfully' });
});

// FORGOT PASSWORD

export const forgotPassword = CatchAsyncError(async (req, res, next) => {
	const user = await Users.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler('User Not Found', 404));
	}

	// GET RESET PASSWORD TOKEN
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	const resetPasswordUrl = `${req.protocol}://${req.get(
		'host'
	)}/reset/password/${resetToken}`;

	const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n  if you are not requested this email then, Please Igone it.`;

	try {
		await sendEmail({
			email: user.email,
			subject: `Widemotos Password Recovery`,
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} Successfully`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorHandler(error.message, 500));
	}
});

// RESET PASSWORD TOKEN

export const resetPassword = CatchAsyncError(async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await Users.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new ErrorHandler(
				'Reset Password Token is notValid or has been expired',
				400
			)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler('Password does not Matched', 400));
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendToken(user, 200, res);
});
