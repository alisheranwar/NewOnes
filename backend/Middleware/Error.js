import ErrorHandler from '../Utils/ErrorHandler';

module.exports = (error, req, res, next) => {
	(error.statusCode = error.statusCode || 500),
		(error.message = error.message || 'Internal Server Error');

	// MONGODB ID KEY ERROR

	if (error.name === 'CastError') {
		const message = `Resource Not Found, Invalid:${error.path}`;

		error = new ErrorHandler(message, 404);
	}

	// Dublicate email Error
	if (error.code === 11000) {
		const message = ` Duplicate:${Object.keys(
			error.keyValue
		)} entered, Please different One`;

		error = new ErrorHandler(message, 400);
	}

	// Wrong JWT ERROR
	if (error.name === 'JsonWebTokenError') {
		const message = ` Json Web token is Invalid.`;

		error = new ErrorHandler(message, 400);
	}

	// Wrong JWT Expire
	if (error.name === 'TokenExpiredError') {
		const message = ` Json Web token is Expired, Please Try again..`;

		error = new ErrorHandler(message, 400);
	}

	res.status(error.statusCode).json({ success: false, error: error.message });
};
