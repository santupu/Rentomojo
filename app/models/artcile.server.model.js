'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post Schema
 */
var ArtcileSchema = new Schema({
	text: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	upvotes: {
		type: Number,
		default: 0
	},
	downvotes: {
		type: Number,
		default: 0
	},
});

mongoose.model('Artcile', ArtcileSchema);
