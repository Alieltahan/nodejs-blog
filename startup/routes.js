const express = require('express');
const error = require('../middleware/error');

module.exports = function(app) {
	app.use(express.json());
	app.use('/api/users', require('../routes/usersRoutes'));
	app.use('/api/auth', require('../routes/authentication'));
	app.use(error);
}
