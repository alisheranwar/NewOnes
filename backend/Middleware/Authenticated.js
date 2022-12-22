import ErrorHandler from '../Utils/ErrorHandler';
import CatchAsyncError from './CatchAsyncError';
import Jwt from 'jsonwebtoken';
import config from '../Config/config';
import User from '../Models/userModel';

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return next(new ErrorHandler('Please Login to Access this resource', 401));
	}

	const decodedData = Jwt.verify(token, config.JWT_SECRET);

	req.user = await User.findById(decodedData.id);

	next();
});

export const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					`Roles: ${req.user.role}, is not allowed to access this resource`,
					403
				)
			);
		}

		next();
	};
};
