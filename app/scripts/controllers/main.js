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

.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
})

.controller('MainCtrl', function($scope, $modal, Room) {
  $scope.rooms = Room.all;
  $scope.newRoom = '';
  $scope.roomSelected = false;
  $scope.roomName = null;

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
  };

  $scope.getMessages = function(id) {
    $scope.messages = Room.messages(id);
    $scope.roomSelected = true;
    $scope.roomName = Room.getName(id);   
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
    },

    messages: function(roomId) {
      var messagelist = [];
      messagelist = $firebaseArray(firebaseRef.child("messages").orderByChild("roomId").equalTo(roomId));
      return messagelist;      
    },

    getName: function(id) {
      firebaseRef.child("rooms/" + id).once("value", function(snap) { 
        roomName = snap.val().name;
      });

      return roomName; 
    }   
  }
}]);
