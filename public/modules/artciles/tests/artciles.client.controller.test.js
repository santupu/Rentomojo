'use strict';

(function() {
	// Artciles Controller Spec
	describe('Artciles Controller Tests', function() {
		// Initialize global variables
		var ArtcilesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Artciles controller.
			ArtcilesController = $controller('ArtcilesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Artcile object fetched from XHR', inject(function(Artciles) {
			// Create sample Artcile using the Artciles service
			var sampleArtcile = new Artciles({
				name: 'New Artcile'
			});

			// Create a sample Artciles array that includes the new Artcile
			var sampleArtciles = [sampleArtcile];

			// Set GET response
			$httpBackend.expectGET('artciles').respond(sampleArtciles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.artciles).toEqualData(sampleArtciles);
		}));

		it('$scope.findOne() should create an array with one Artcile object fetched from XHR using a artcileId URL parameter', inject(function(Artciles) {
			// Define a sample Artcile object
			var sampleArtcile = new Artciles({
				name: 'New Artcile'
			});

			// Set the URL parameter
			$stateParams.artcileId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/artciles\/([0-9a-fA-F]{24})$/).respond(sampleArtcile);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.artcile).toEqualData(sampleArtcile);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Artciles) {
			// Create a sample Artcile object
			var sampleArtcilePostData = new Artciles({
				name: 'New Artcile'
			});

			// Create a sample Artcile response
			var sampleArtcileResponse = new Artciles({
				_id: '525cf20451979dea2c000001',
				name: 'New Artcile'
			});

			// Fixture mock form input values
			scope.name = 'New Artcile';

			// Set POST response
			$httpBackend.expectPOST('artciles', sampleArtcilePostData).respond(sampleArtcileResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Artcile was created
			expect($location.path()).toBe('/artciles/' + sampleArtcileResponse._id);
		}));

		it('$scope.update() should update a valid Artcile', inject(function(Artciles) {
			// Define a sample Artcile put data
			var sampleArtcilePutData = new Artciles({
				_id: '525cf20451979dea2c000001',
				name: 'New Artcile'
			});

			// Mock Artcile in scope
			scope.artcile = sampleArtcilePutData;

			// Set PUT response
			$httpBackend.expectPUT(/artciles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/artciles/' + sampleArtcilePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid artcileId and remove the Artcile from the scope', inject(function(Artciles) {
			// Create new Artcile object
			var sampleArtcile = new Artciles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Artciles array and include the Artcile
			scope.artciles = [sampleArtcile];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/artciles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleArtcile);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.artciles.length).toBe(0);
		}));
	});
}());