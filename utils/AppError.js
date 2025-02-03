class AppError extends Error {
	constructor(message, statusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.error = message;
		this.isOperational = true; // A flag to know that error is handled during dev.

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
