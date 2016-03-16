'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Artcile = mongoose.model('Artcile'),
	_ = require('lodash');

/**
 * Create a Artcile
 */
exports.create = function(req, res) {
	var artcile = new Artcile(req.body);
	artcile.user = req.user;

	artcile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artcile);
		}
	});
};

/**
 * Show the current Artcile
 */
exports.read = function(req, res) {
	res.jsonp(req.artcile);
};

/**
 * Update a Artcile
 */
exports.update = function(req, res) {
	var artcile = req.artcile ;

	artcile = _.extend(artcile , req.body);

	artcile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artcile);
		}
	});
};

/**
 * Delete an Artcile
 */
exports.delete = function(req, res) {
	var artcile = req.artcile ;

	artcile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artcile);
		}
	});
};

/**
 * List of Artciles
 */
exports.list = function(req, res) {
	Artcile.find().sort('-created').populate('user', 'displayName').exec(function(err, artciles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artciles);
		}
	});
};

/**
 * Artcile middleware
 */
exports.artcileByID = function(req, res, next, id) {
	Artcile.findById(id).populate('user', 'displayName').exec(function(err, artcile) {
		if (err) return next(err);
		if (! artcile) return next(new Error('Failed to load Artcile ' + id));
		req.artcile = artcile ;
		next();
	});
};

/**
 * Artcile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.artcile.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
