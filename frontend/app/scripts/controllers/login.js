'use strict';

/**
 * @ngdoc function
 * @name jwtApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the jwtApp
 */
angular.module('jwtApp').controller('LoginCtrl', function($scope, alert, auth) {
  $scope.submit = function() {
    auth.login($scope.email, $scope.password).success(function(res) {
      alert('success', 'Welcome', 'Thanks for coming back ' +res.user.email + '!');
    }).error(function(err) {
      alert('warning', 'Opps!', err.message);
    });
  };
});
