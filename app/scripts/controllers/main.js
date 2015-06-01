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

.run(['$rootScope', '$cookies', function($rootScope, $cookies) {

  if (!$cookies.blocChatCurrentUser || $cookies.blocChatCurrentUser === '' ) {
    angular.element('#loginModal').modal({backdrop:'static'});
    angular.element('#loginModal').modal('show');
  }

}])

.controller('MainCtrl', function($scope, $cookies, $state, Room, Message, User, $timeout) {
  $scope.rooms = Room.all;
  $scope.newRoom = {newRoom: '', isPrivate: false};
  $scope.roomSelected = false;
  $scope.roomName = null;
  $scope.roomId = null;
  $scope.newMessage = {content: '', roomId: '', sentAt: null, username: ''}; 
  $scope.username = $cookies.blocChatCurrentUser;
  $scope.users = User.getUsers();
  $scope.loggedInUser = User.getUser();

  if (!$cookies.blocChatCurrentUser || $cookies.blocChatCurrentUser === '' ) {
    angular.element('#loginModal').modal({backdrop:'static'});
    angular.element('#loginModal').modal('show');
  } else {
    angular.element('#loginModal').modal('hide');
  } 

  $scope.addRoom = function (newRoom) {

    var newRoomName = $scope.newRoom.newRoom.trim();
    if (!newRoomName.length) {
      return;
    }

    Room.create(newRoomName, newRoom.isPrivate);

    $scope.newRoom = {newRoom: '', isPrivate: false}; 
  }

  $scope.addUser = function (newUser) {
    if (newUser === undefined) {
      angular.element('#userModal').modal({backdrop: 'static'});
      angular.element('#userModal').modal('show');      
    } else {
      $cookies.blocChatCurrentUser = newUser;
      $scope.newUser = '';     
      angular.element('#userModal').modal('hide');
    } 
  }
  
  $scope.addMessage = function () {
    if ($scope.roomId === '') {
      return;
    }

    var tempMessage = {content: $scope.newMessage.content, roomId: $scope.roomId, sentAt: Date(), username: $scope.username}; 

    tempMessage.content = $scope.newMessage.content;

    Message.send(tempMessage);

    $scope.newMessage = {content: '', roomId: '', sentAt: null, username: ''};                              
    angular.element('#messageModal').modal('hide');
  }

  $scope.getMessages = function(id) {
    $scope.messages = Room.messages(id);
    $scope.roomSelected = true;
    $scope.roomName = Room.getName(id); 
    $scope.roomId = id;  
  };

  function callAtTimeout() {
    //console.log("Timeout occurred");
    $scope.userUid = User.getUid();  
  }

  function callAtTimeout2() {
    //console.log("Timeout2 occurred");
    $state.go('profile', { uid: $scope.userUid });        
  }  

  $scope.login = function (email, password) {
    angular.element('#loginModal').modal('hide'); 
    var newUser = {email: email, password: password};
    var loginPromise = User.login(newUser);

    $timeout(callAtTimeout2, 1000);  
  }

  $scope.logout = function () {
    User.logout();
    $state.go('home');
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
    create: function (newRoom, isPrivate) {
      rooms.$add({
        name: newRoom,
        isPrivate: isPrivate
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

}])

.factory('User', ['$firebaseArray', '$firebaseAuth', '$cookies', function($firebaseArray, $firebaseAuth, $cookies) {
  var firebaseRef = new Firebase('https://kts-blocchat.firebaseio.com/');
  var Auth = $firebaseAuth(firebaseRef);

  var user = {
    name: '',
    email: '',
    password: '',
    isAdmin: false
  }

  var currentStatus = "★ online";
  var userListRef = new Firebase("https://kts-blocchat.firebaseio.com/sessions");
  var myUserRef = userListRef.push();
  myUserRef.onDisconnect().remove();

  function setUserStatus(name, status) {
    // Set our status in the list of online users.
    currentStatus = status;
    myUserRef.set({ name: name, status: status });
  }  

  // whenever authentication happens send a popup
  firebaseRef.onAuth(function globalOnAuth(authData) {

    if (authData) {
        //console.log('authData = ' + angular.toJson(authData));
        var name = authData.password.email.replace(/@.*/, '');
        var userRef = firebaseRef.child('users').child(authData.uid);
        userRef.once('value', function (snap) {
            user = snap.val();
            if (user == null) {
              firebaseRef.child("users").child(authData.uid).set({
                isAdmin: false,
                name: name
              });              
            }

            $cookies.blocChatCurrentUser = user.name;
        });

    } else {
      $cookies.blocChatCurrentUser = '';
    }

  });

  function authHandler(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      //console.log("Authenticated successfully with payload:", authData);
    }
  }  

  return {
    login: function (newUser) {
      firebaseRef.authWithPassword({
        email    : newUser.email,
        password : newUser.password
      }, authHandler);
    },
    logout: function () {
      firebaseRef.unauth();
    },
    getUser: function () {
      setUserStatus(user.name, "★ online");
      return user;
    },
    getUid: function () {
      var authData = firebaseRef.getAuth();
      if (authData) {
        return authData.uid;
      }  
    },
    getUsers: function() {
      var users = $firebaseArray(firebaseRef.child('sessions'));
      return users;   
    }
  }

}]);


