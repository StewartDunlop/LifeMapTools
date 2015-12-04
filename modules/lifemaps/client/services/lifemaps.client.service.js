'use strict';

//Lifemaps service used for communicating with the lifemaps REST endpoints
angular.module('lifemaps').factory('Lifemaps', ['$resource',
    function ($resource) {
        return $resource('api/lifemaps/:lifemapId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
