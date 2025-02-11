import Logger from '../services/Logger';

class AppError extends Error {
	statusCode: number;
	status: string;
	description: string;
	isOperational: boolean;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.description = message;
		this.isOperational = true; // A flag to know that error is handled during dev.

		Logger.log('info', message);

		Error.captureStackTrace(this, this.constructor);
	}

}

export default AppError;
