import nodemailer from 'nodemailer';
import config from '../Config/config';

export const sendEmail = async (options) => {
	const trasporter = nodemailer.createTransport({
		service: config.SMPT_SERVICES,
		auth: {
			user: config.SMPT_MAIL,
			pass: config.SMPT_PASSWORD,
		},
	});

	const mailOptions = {
		from: config.SMPT_MAIL,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await trasporter.sendMail(mailOptions);
};
