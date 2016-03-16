'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	//CommentSchema
	var CommentSchema = new Schema({
		name: {
			type: String,
			default: '',
			trim: true
		},
		description: {
			type: String,
			default: '',
			required: 'Please fill Artcile description',
			trim: true
		},
		created: {
			type: Date,
			default: Date.now
		},
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		}
	});
/**
 * Post Schema
 */
var PostSchema = new Schema({
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
	comments: [CommentSchema]
});

mongoose.model('Post', PostSchema);
