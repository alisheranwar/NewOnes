import config from '../Config/config';

const sendToken = (user, statusCode, res) => {
	const token = user.getJwtToken();

	// Options for COOKIE

	const options = {
		expires: new Date(Date.now() + config.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),

		httpOnly: true,
	};

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		user,
		token,
	});
};

export default sendToken;
