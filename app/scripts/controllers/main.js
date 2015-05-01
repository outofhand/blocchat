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
	.controller('MainCtrl', function ($scope, Room) {
		$scope.rooms = Room.all;
	})

	.factory('Room', ['$firebaseArray', function($firebaseArray) {
	  var firebaseRef = new Firebase('https://kts-blocchat.firebaseio.com/'); 
	  var rooms = $firebaseArray(firebaseRef.child('rooms'));

	  return {
	    all: rooms  
	  }
	}]);