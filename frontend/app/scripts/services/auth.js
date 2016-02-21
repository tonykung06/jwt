'use strict';

/**
 * @ngdoc service
 * @name jwtApp.auth
 * @description
 * # auth
 * Service in the jwtApp.
 */
angular.module('jwtApp').service('auth', function ($http, $state, API_URL, authToken) {
  // AngularJS will instantiate a singleton by calling "new" on this function

  var authSuccess = function(res) {
    authToken.setToken(res.token);
    $state.go('main');
  };

  this.login = function(email, password) {
    return $http.post(API_URL + 'login', {
      email: email,
      password: password
    }).success(authSuccess);
  };

  this.register = function(email, password) {
    return $http.post(API_URL + 'register', {
      email: email,
      password: password
    }).success(authSuccess);
  };
});
