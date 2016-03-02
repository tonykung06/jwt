'use strict';

/**
 * @ngdoc function
 * @name jwtApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the jwtApp
 */
angular.module('jwtApp').controller('LoginCtrl', function($scope, $state, alert, auth, $auth) {
  var handleAuthError = function(err) {
      alert('warning', 'Opps!', err.message || 'login failed');
  };

  // $scope.submit = function() {
  //   auth.login($scope.email, $scope.password).success(function(res) {
  //     alert('success', 'Welcome', 'Thanks for coming back ' + res.user.email + '!');
  //   }).error(handleAuthError);
  // };

  $scope.submit = function() {
    $auth.login({
      email: $scope.email,
      password: $scope.password
    }).then(function(res) {
      alert('success', 'Welcome', 'Thanks for coming back ' + res.data.user.email + '!');
      $state.go('main');
    }).catch(handleAuthError);
  };

  $scope.google = function() {
    auth.googleAuth().then(function(result) {
      alert('success', 'Welcome', 'Thanks for coming back ' + result.user.displayName + '!');
    }, handleAuthError);
  };

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider).then(function(result) {
      alert('success', 'Welcome', 'Thanks for coming back ' + result.data.user.displayName + '!');
      $state.go('main');
    }, handleAuthError);
  };
});
