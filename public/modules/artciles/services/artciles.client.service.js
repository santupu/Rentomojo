'use strict';

//Artciles service used to communicate Artciles REST endpoints
angular.module('artciles').factory('Artciles', ['$resource',
	function($resource) {
		return $resource('artciles/:artcileId', { artcileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			getComment: {
				url: '/artciles',
				method: 'GET',
				isArray: true
			}
		});
	}
]);
