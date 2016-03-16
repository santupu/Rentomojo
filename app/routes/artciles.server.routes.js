'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var artciles = require('../../app/controllers/artciles.server.controller');

	// Artciles Routes
	app.route('/artciles')
		.get(artciles.list)
		.post(users.requiresLogin, artciles.create);

	app.route('/artciles/:artcileId')
		.get(artciles.read)
		.put(users.requiresLogin, artciles.hasAuthorization, artciles.update)
		.delete(users.requiresLogin, artciles.hasAuthorization, artciles.delete);

	// Finish by binding the Artcile middleware
	app.param('artcileId', artciles.artcileByID);
};
