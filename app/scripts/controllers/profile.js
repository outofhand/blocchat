'use strict';

/**
 * @ngdoc function
 * @name blocchatApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the blocchatApp
 */
angular.module('blocchatApp')

.controller('ProfileCtrl', ['$scope', 'User', '$state', function($scope, User, $state) {

	$scope.user = {
		name: '',
		email: '',
		password: '',
		isAdmin: false
	}

	$scope.user = User.getUser();
	if ( $scope.user.email == '' ) {
		$state.go('home');		
	}	

	$scope.logout = function () {
		User.logout();
		$state.go('home');
	}

}]);



