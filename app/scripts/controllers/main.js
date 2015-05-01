/* global Firebase */

'use strict';

/**
 * @ngdoc function
 * @name blocchatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blocchatApp
 */
angular.module('blocchatApp')

.controller('MainCtrl', function($scope, $modal, Room) {
  $scope.rooms = Room.all;
  $scope.newRoom = '';

  $scope.open = function() {

    var modalInstance = $modal.open({
      templateUrl: 'newRoom.html',
      controller: 'ModalInstanceCtrl',
      size: 'sm',
      resolve: {
        newRoom: function() {
          return $scope.newRoom;
        }
      }
    });

  }

})  

.factory('Room', ['$firebaseArray', function($firebaseArray) {
  var firebaseRef = new Firebase('https://kts-blocchat.firebaseio.com/');  
  var rooms = $firebaseArray(firebaseRef.child('rooms'));
  var roomName = [];

  return {
    all: rooms,

    create: function(newRoom) {
      rooms.$add({
        name: newRoom,
        type: 'public'
      })
    }
  }
}]);
