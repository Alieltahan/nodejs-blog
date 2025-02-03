const winston = require('winston');
const AppError = require('../utils/AppError');

module.exports = function(err, req, res){
		winston.error(err.message, err);
		res.status(500).send(new AppError(err, 500));
}
