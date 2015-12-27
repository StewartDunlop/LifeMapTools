'use strict';

// Lifemaps controller
angular.module('lifemaps').controller('LifemapsController', ['$scope', '$stateParams', '$location',
    'Authentication', 'Lifemaps', 'Restservice',
    function ($scope, $stateParams, $location, Authentication, Lifemaps, Restservice) {
        $scope.authentication = Authentication;

        var defYPos = 200;
        var defXPos = 200;
        var defWidth = 200;
        var defHeight = 200;

        // Create new Lifemap
        $scope.addMap = function () {
            $scope.error = null;
            console.log('Add a map');
            // Create new Lifemap object
            var information = {
                title : 'New Title'
            };
            var lifemap = new Lifemaps({
                information : information,
                xpos : defYPos,
                ypos : defXPos,
                width : defWidth,
                height : defHeight,
                expanded_height : defHeight,
                showbody : true,
                accordion : true,
                draggable : true,
                resizable : true
            });

            // Get Restangularised lifemap back
            lifemap.$save(function (lifemap) {
                Restservice.one('lifemaps', lifemap._id).get().then(function(lm) {
                    $scope.lifemaps.push(lm);
                });
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
        $scope.findAll = function () {
            Restservice.all('lifemapsForUser').getList({userId: $scope.authentication.user._id}).then(
                function(lifemapsForUser) {
                    $scope.lifemaps = lifemapsForUser;
                }
            );
        };

        // Find existing Lifemap
        $scope.findOne = function () {
            $scope.lifemap = Lifemaps.get({
                lifemapId: $stateParams.lifemapId
            });
        };

    }
]);
