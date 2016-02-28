'use strict';

/**
 * @ngdoc service
 * @name jwtApp.auth
 * @description
 * # auth
 * Service in the jwtApp.
 */
angular.module('jwtApp').service('auth', function ($http, $state, $window, $q, API_URL, authToken) {
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

  var urlBuilder = [];
  var clientId = '1028235431595-5sadnj969clrtvh9doio7eab8sk9i9c2.apps.googleusercontent.com';
  urlBuilder.push(
    'response_type=code',
    'client_id=' + clientId,
    'redirect_uri=' + window.location.origin,
    'scope=openid profile email'
  );

  this.googleAuth = function(options) {
    var url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urlBuilder.join('&');
    var options = 'width=500, height=500, left=' + ($window.outerWidth - 500) / 2 + ', top=' + ($window.outerHeight - 500) / 2.5;
    var deferred = $q.defer();

    var popup = $window.open(url, '', options);
    $window.focus();

    $window.addEventListener('message', function(event) {
      if (event.origin === $window.location.origin) {
        var code = event.data;
        popup.close();

        $http.post(API_URL + 'auth/google', {
          code: code,
          clientId: clientId,
          redirectUri: window.location.origin
        }).success(function(response) {
          authSuccess(response);
          deferred.resolve(response);
        });
      }
    });

    return deferred.promise;
  };
});
