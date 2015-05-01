'use strict';

/**
 * @ngdoc function
 * @name blocchatApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the blocchatApp
 */
angular.module('blocchatApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
