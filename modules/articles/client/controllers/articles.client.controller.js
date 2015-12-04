'use strict';

// Articles controller
angular.module('articles').controller('LifemapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Lifemaps) {
    $scope.authentication = Authentication;

    // Create new Lifemap
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'lifemapForm');

        return false;
      }

      // Create new Article object
      var lifemap = new Lifemaps({

      });

      // Redirect after save
      lifemap.$save(function (response) {
        $location.path('lifemaps/' + response._id);

        // Clear form fields

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
        $location.path('lifemap/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
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
