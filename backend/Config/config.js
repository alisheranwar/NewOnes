import dotenv from 'dotenv';

dotenv.config();

export default {
	MONGODB_URL: process.env.MONGODB_URL,
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRES: process.env.JWT_EXPIRES,
	COOKIE_EXPIRES: process.env.COOKIE_EXPIRES,
	SMPT_SERVICES: process.env.SMPT_SERVICES,
	SMPT_MAIL: process.env.SMPT_MAIL,
	SMPT_PASSWORD: process.env.SMPT_PASSWORD,
};
