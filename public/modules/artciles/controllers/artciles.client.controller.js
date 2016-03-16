'use strict';

// Artciles controller
angular.module('artciles').controller('ArtcilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Artciles',
	function($scope, $stateParams, $location, Authentication, Artciles) {
		$scope.authentication = Authentication;

		// Create new Artcile
		$scope.create = function() {
			// Create new Artcile object
			var artcile = new Artciles ({
				text: this.text
			});

			// Redirect after save
			artcile.$save(function(response) {
					$scope.findOne ();
					$location.path('/artciles');

				// Clear form fields
				$scope.text = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Artcile
		$scope.remove = function(artcile) {
			if ( artcile ) {
				artcile.$remove();

				for (var i in $scope.artciles) {
					if ($scope.artciles [i] === artcile) {
						$scope.artciles.splice(i, 1);
					}
				}
			} else {
				$scope.artcile.$remove(function() {
					$location.path('artciles');
				});
			}
		};


		// Update existing Artcile
		$scope.update = function() {
			var artcile = $scope.artcile;

			artcile.$update(function() {
				$location.path('artciles/' + artcile._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Artciles
		$scope.find = function() {
			$scope.artciles = Artciles.query();
		};

		// Find existing Artcile
		$scope.findOne = function() {
			$scope.artciles = Artciles.getComment({
				artcileId: $stateParams.artcileId
			});
		};
		$scope.upvotes = function(index) {
			var thisArticle = $scope.artciles[index];
			var currentUpvotes = thisArticle.upvotes;
			thisArticle.upvotes = currentUpvotes + 1;
			var thisArticleObject = new Artciles(thisArticle);
			thisArticleObject.$update(function() {
				$location.path('/artciles');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		$scope.downvotes = function(index) {
			var thisArticle = $scope.artciles[index];
			var currentDownvotes = thisArticle.downvotes;
			thisArticle.downvotes = currentDownvotes + 1;
			var thisArticleObject = new Artciles(thisArticle);
			thisArticleObject.$update(function() {
				$location.path('/artciles');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};
	}
]);
