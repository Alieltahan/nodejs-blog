const {createLogger, transports, format} = require( "winston" );

const Logger = createLogger( {
	level: "error",
	format: format.json(),
	defaultMeta: {
		service: "node-express-service",
		time: new Date().toISOString()
	},
	transports: [
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		new transports.Console({
			level: "error",
			filename: "exceptions.log",
			handleExceptions: true,
			json: true
		}),
		new transports.File( { filename: "error.log", level: "error" } ),
		new transports.File( { filename: "combined.log" } ),
	],
	exceptionHandlers: [
		new transports.File({ filename: 'exceptions.log' })
	],
	rejectionHandlers: [
		new transports.File({ filename: 'rejections.log' })
	],
	exitOnError: false

} );

export default Logger;
