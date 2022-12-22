import mongoose from 'mongoose';
import config from '../Config/config';

const mainDataBase = () => {
	mongoose
		.connect(config.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('Success Granted for DataBase');
		});
};

export default mainDataBase;
