import app from './app';
import config from './Config/config';
import mainDataBase from './Database/Mongodb';

// MAIN DATABSE USES
mainDataBase();

process.on('uncaughtException', (error) => {
	console.log(`Error: ${error.message}`);

	console.log('Shutting down the server due UncaughtException');
	process.exit(1);
});

const server = app.listen(config.PORT, () => {
	console.log(`Files are serve at http://localhost:${config.PORT}`);
});

process.on('unhandledRejection', (error) => {
	console.log(`Error: ${error.message}`);

	console.log('Shuttind Down the Server due to UnhandledPromise Rejection');

	server.close(() => {
		process.exit(1);
	});
});
