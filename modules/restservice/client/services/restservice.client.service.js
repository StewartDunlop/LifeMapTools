'use strict';

angular.module('restservice').factory('Restservice', ['Restangular',
	function(Restangular) {
		Restangular.setRestangularFields({
			id: '_id'
		});
		return Restangular;
	}
]);
