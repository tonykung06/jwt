'use strict';

/**
 * @ngdoc function
 * @name jwtApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the jwtApp
 */
angular.module('jwtApp').controller('RegisterCtrl', function ($scope, $rootScope, $state, alert, auth, $auth) {
  // $scope.submit = function() {
  //   auth.register($scope.email, $scope.password).success(function(res) {
  //     alert('success', 'Account Created!', 'Welcome, ' + res.user.email + '!');
  //   }).error(function(err) {
  //     alert('warning', 'Opps!', err.message || 'Could not register');
  //   });
  // };

  $scope.submit = function() {
    $auth.signup({
      email: $scope.email,
      password: $scope.password
    }).then(function(res) {
      $auth.setToken(res.data.token);
      alert('success', 'Account Created!', 'Welcome, ' + res.data.user.email + '! Please email activate your account.');
      $state.go('main');
    }).catch(function(err) {
      alert('warning', 'Opps!', err.message || 'Could not register');
    });
  };
});
