'use strict';

/**
 * @ngdoc function
 * @name jwtApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the jwtApp
 */
angular.module('jwtApp').controller('JobsCtrl', function ($scope) {
  $scope.jobs = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
});
