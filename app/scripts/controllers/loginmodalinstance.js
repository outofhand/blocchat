/* global Firebase */

'use strict';

/**
 * @ngdoc function
 * @name blocchatApp.controller:LoginModalInstanceCtrl
 * @description
 * # LoginModalInstanceCtrl
 * Controller of the blocchatApp
 */
angular.module('blocchatApp')

.controller('LoginModalInstanceCtrl', function($scope, $modalInstance, newUser, $cookies) {

          $scope.newUser = newUser;

/*          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };*/

          $scope.ok = function () {
              var newUser = $scope.newUser.trim();
              if (!newUser.length) {
                return;
              }

              $modalInstance.close(newUser);
          };

});  