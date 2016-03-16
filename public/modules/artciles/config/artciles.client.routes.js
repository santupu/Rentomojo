'use strict';

//Setting up route
angular.module('artciles').config(['$stateProvider',
	function($stateProvider) {
		// Artciles state routing
		$stateProvider.
		state('listArtciles', {
			url: '/artciles',
			templateUrl: 'modules/artciles/views/create-artcile.client.view.html'
		}).
		state('createArtcile', {
			url: '/artciles/create',
			templateUrl: 'modules/artciles/views/create-artcile.client.view.html'
		}).
		state('viewArtcile', {
			url: '/artciles/:artcileId',
			templateUrl: 'modules/artciles/views/view-artcile.client.view.html'
		}).
		state('editArtcile', {
			url: '/artciles/:artcileId/edit',
			templateUrl: 'modules/artciles/views/edit-artcile.client.view.html'
		});
	}
]);
