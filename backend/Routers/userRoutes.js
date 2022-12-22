import express from 'express';
import {
	createUser,
	forgotPassword,
	loginUser,
	logoutUser,
	resetPassword,
} from '../Controllers/userController';

const router = express.Router();

router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/reset/password').post(forgotPassword);
router.route('/reset/password/:token').put(resetPassword);

export default router;
