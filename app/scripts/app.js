'use strict';

/**
 * @ngdoc overview
 * @name blocchatApp
 * @description
 * # blocchatApp
 *
 * Main module of the application.
 */
angular
  .module('blocchatApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'ui.router'  
  ])

  .config(function($stateProvider, $urlRouterProvider) {
  
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        data: {
          requireLogin: true
        }          
      })         
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        data: {
          requireLogin: false
        }           
      });           
  })
