/* global Firebase */

'use strict';
var room;
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

.run(function($cookies, $modal, $log, Room) {
  if (!$cookies.blocChatCurrentUser || $cookies.blocChatCurrentUser === '') {
    var newUser = '';
    var modalInstance = $modal.open({
        templateUrl: 'views/login.html',
        controller: 'LoginModalInstanceCtrl',
        size: 'sm',
        backdrop: 'static',
        resolve: {
          newUser: function() {
            return $cookies.blocChatCurrentUser;
          }
        }
    });

    modalInstance.result.then(function (newUser) {
      $cookies.blocChatCurrentUser = newUser;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  }
})

.controller('MainCtrl', function($scope, $modal, $cookies, Room, Message) {
  $scope.rooms = Room.all;
  $scope.newRoom = '';
  $scope.roomSelected = false;
  $scope.roomName = null;
  $scope.roomId = null;
  $scope.newMessage = {content: '', roomId: '', sentAt: null, username: ''}; 
  
  $scope.$watch(function() { return $cookies.blocChatCurrentUser; }, function() {
        $scope.username = $cookies.blocChatCurrentUser;
    });
  

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
    $scope.roomId = id;  
  };

  $scope.openMessage = function () {
    if ($scope.roomId === '') {
      return;
    }

    var tempMessage = {content: $scope.newMessage.content, roomId: $scope.roomId, sentAt: Date(), username: $scope.username}; 

    var modalInstance = $modal.open({
      templateUrl: 'newMessage.html',
      controller: function ($scope) {
          $scope.cancelMessage = function () {
              $scope.$dismiss();
          };

          $scope.okMessage = function () {
            tempMessage.content = $scope.newMessage.content;

            Message.send(tempMessage);

            $scope.newMessage = {content: '', roomId: '', sentAt: null, username: ''};                              
            $scope.$close();
          };
      },
      size: 'sm',
      resolve: {
        newMessage: function() {
          return $scope.newMessage;
        }
      }
    });
  }  

})  

.factory('Room', ['$firebaseArray', function($firebaseArray) {
  var firebaseRef = new Firebase('https://kts-blocchat.firebaseio.com/');  
  var rooms = $firebaseArray(firebaseRef.child('rooms'));
  var roomName = [];
  var username;
  return {
    all: rooms,
    getUsername: function () {
      return username;
    },
    setUsername: function (name) {
      username = name;
    },
    create: function (newRoom) {
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
}])

.factory('Message', ['$firebaseArray', '$cookies', function($firebaseArray, $cookies) {
  var firebaseRef = new Firebase('https://kts-blocchat.firebaseio.com/');
  var messages = $firebaseArray(firebaseRef.child('messages'));

  return {
    send: function (newMessage) {
      messages.$add({
        content: newMessage.content,
        roomId: newMessage.roomId,
        sentAt: Date(),
        username: newMessage.username
      });
    }
  }

}]);
