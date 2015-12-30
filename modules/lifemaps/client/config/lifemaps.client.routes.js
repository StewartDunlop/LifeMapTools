'use strict';

// Setting up route
angular.module('lifemaps').config(['$stateProvider',
    function ($stateProvider) {
        // Articles state routing
        $stateProvider
            .state('lifemaps', {
                abstract: true,
                url: '/lifemaps',
                template: '<ui-view/>'
            })
            .state('lifemaps.view', {
                url: '/:lifemapId',
                templateUrl: 'modules/lifemaps/client/views/view-lifemaps.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            });
    }
]);
