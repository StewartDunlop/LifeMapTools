'use strict';

// Lifemaps controller
angular.module('lifemaps').controller('LifemapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lifemaps',
    function ($scope, $stateParams, $location, Authentication, Lifemaps) {
        $scope.authentication = Authentication;

        // Create new Lifemap
        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'lifemapForm');

                return false;
            }

            // Create new Lifemap object
            var lifemap = new Lifemaps({
                title: this.title,
                content: this.content
            });

            // Redirect after save
            lifemap.$save(function (response) {
                $location.path('lifemaps/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Lifemap
        $scope.remove = function (lifemap) {
            if (lifemap) {
                lifemap.$remove();

                for (var i in $scope.lifemaps) {
                    if ($scope.lifemaps[i] === lifemap) {
                        $scope.lifemaps.splice(i, 1);
                    }
                }
            } else {
                $scope.lifemap.$remove(function () {
                    $location.path('lifemaps');
                });
            }
        };

        // Update existing Lifemap
        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'lifemapForm');

                return false;
            }

            var lifemap = $scope.lifemap;

            lifemap.$update(function () {
                $location.path('lifemaps/' + lifemap._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Lifemaps
        $scope.find = function () {
            $scope.lifemaps = Lifemaps.query();
        };

        // Find existing Lifemap
        $scope.findOne = function () {
            $scope.lifemap = Lifemaps.get({
                lifemapId: $stateParams.lifemapId
            });
        };
    }
]);
