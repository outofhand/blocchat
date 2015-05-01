/* global Firebase */

'use strict';

/**
 * @ngdoc function
 * @name blocchatApp.controller:ModalInstanceCtrl
 * @description
 * # ModalInstanceCtrl
 * Controller of the blocchatApp
 */
angular.module('blocchatApp')

.controller('ModalInstanceCtrl', function($scope, $modalInstance, newRoom, Room) {

          $scope.newRoom = newRoom;

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          $scope.ok = function () {
              var newRoom = $scope.newRoom.trim();
              if (!newRoom.length) {
                return;
              }

              Room.create(newRoom);

              $scope.newRoom = '';                              
              $modalInstance.close($scope.newRoom);
          };

});  