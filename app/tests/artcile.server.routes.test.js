'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Artcile = mongoose.model('Artcile'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, artcile;

/**
 * Artcile routes tests
 */
describe('Artcile CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Artcile
		user.save(function() {
			artcile = {
				name: 'Artcile Name'
			};

			done();
		});
	});

	it('should be able to save Artcile instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artcile
				agent.post('/artciles')
					.send(artcile)
					.expect(200)
					.end(function(artcileSaveErr, artcileSaveRes) {
						// Handle Artcile save error
						if (artcileSaveErr) done(artcileSaveErr);

						// Get a list of Artciles
						agent.get('/artciles')
							.end(function(artcilesGetErr, artcilesGetRes) {
								// Handle Artcile save error
								if (artcilesGetErr) done(artcilesGetErr);

								// Get Artciles list
								var artciles = artcilesGetRes.body;

								// Set assertions
								(artciles[0].user._id).should.equal(userId);
								(artciles[0].name).should.match('Artcile Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Artcile instance if not logged in', function(done) {
		agent.post('/artciles')
			.send(artcile)
			.expect(401)
			.end(function(artcileSaveErr, artcileSaveRes) {
				// Call the assertion callback
				done(artcileSaveErr);
			});
	});

	it('should not be able to save Artcile instance if no name is provided', function(done) {
		// Invalidate name field
		artcile.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artcile
				agent.post('/artciles')
					.send(artcile)
					.expect(400)
					.end(function(artcileSaveErr, artcileSaveRes) {
						// Set message assertion
						(artcileSaveRes.body.message).should.match('Please fill Artcile name');
						
						// Handle Artcile save error
						done(artcileSaveErr);
					});
			});
	});

	it('should be able to update Artcile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artcile
				agent.post('/artciles')
					.send(artcile)
					.expect(200)
					.end(function(artcileSaveErr, artcileSaveRes) {
						// Handle Artcile save error
						if (artcileSaveErr) done(artcileSaveErr);

						// Update Artcile name
						artcile.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Artcile
						agent.put('/artciles/' + artcileSaveRes.body._id)
							.send(artcile)
							.expect(200)
							.end(function(artcileUpdateErr, artcileUpdateRes) {
								// Handle Artcile update error
								if (artcileUpdateErr) done(artcileUpdateErr);

								// Set assertions
								(artcileUpdateRes.body._id).should.equal(artcileSaveRes.body._id);
								(artcileUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Artciles if not signed in', function(done) {
		// Create new Artcile model instance
		var artcileObj = new Artcile(artcile);

		// Save the Artcile
		artcileObj.save(function() {
			// Request Artciles
			request(app).get('/artciles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Artcile if not signed in', function(done) {
		// Create new Artcile model instance
		var artcileObj = new Artcile(artcile);

		// Save the Artcile
		artcileObj.save(function() {
			request(app).get('/artciles/' + artcileObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', artcile.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Artcile instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artcile
				agent.post('/artciles')
					.send(artcile)
					.expect(200)
					.end(function(artcileSaveErr, artcileSaveRes) {
						// Handle Artcile save error
						if (artcileSaveErr) done(artcileSaveErr);

						// Delete existing Artcile
						agent.delete('/artciles/' + artcileSaveRes.body._id)
							.send(artcile)
							.expect(200)
							.end(function(artcileDeleteErr, artcileDeleteRes) {
								// Handle Artcile error error
								if (artcileDeleteErr) done(artcileDeleteErr);

								// Set assertions
								(artcileDeleteRes.body._id).should.equal(artcileSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Artcile instance if not signed in', function(done) {
		// Set Artcile user 
		artcile.user = user;

		// Create new Artcile model instance
		var artcileObj = new Artcile(artcile);

		// Save the Artcile
		artcileObj.save(function() {
			// Try deleting Artcile
			request(app).delete('/artciles/' + artcileObj._id)
			.expect(401)
			.end(function(artcileDeleteErr, artcileDeleteRes) {
				// Set message assertion
				(artcileDeleteRes.body.message).should.match('User is not logged in');

				// Handle Artcile error error
				done(artcileDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Artcile.remove().exec();
		done();
	});
});